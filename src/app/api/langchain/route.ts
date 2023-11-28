import { StreamingTextResponse } from 'ai'
import type { Message, Message as VercelChatMessage } from 'ai'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import type { Document } from 'langchain/document'
import { JSONLoader } from 'langchain/document_loaders/fs/json'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PromptTemplate } from 'langchain/prompts'
import { BytesOutputParser, StringOutputParser } from 'langchain/schema/output_parser'
import { RunnableSequence } from 'langchain/schema/runnable'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { MODELS } from '@/utils/constants'

const combineDocumentsFn = (docs: Document[], separator = '\n\n') => {
  const serializedDocs = docs.map((doc) => doc.pageContent)
  return serializedDocs.join(separator)
}

const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  const formattedDialogueTurns = chatHistory.map((message) => {
    if (message.role === 'user') {
      return `Human: ${message.content}`
    } else if (message.role === 'assistant') {
      return `Assistant: ${message.content}`
    } else {
      return `${message.role}: ${message.content}`
    }
  })
  return formattedDialogueTurns.join('\n')
}

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`
const condenseQuestionPrompt = PromptTemplate.fromTemplate(CONDENSE_QUESTION_TEMPLATE)

const ANSWER_TEMPLATE = `
Answer the question based only on the following context and chat history:
<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
`
const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE)

const getTxtFileDocuments = async (fileURLs: string[]): Promise<Document[]> => {
  const txtFileBuffers: Buffer[] = []
  const txtFileURLs = fileURLs.filter((url) => url.toLowerCase().endsWith('.txt'))

  for (const fileURL of txtFileURLs) {
    const response = await fetch(fileURL)
    if (!response.ok) {
      throw new Error(`Network response was not ok for file: ${fileURL}`)
    }
    const arrayBuffer = await response.arrayBuffer()
    const fileAsBuffer = Buffer.from(arrayBuffer)
    txtFileBuffers.push(fileAsBuffer)
  }

  const blob = new Blob(txtFileBuffers, { type: 'text/plain' })
  const txtLoader = new TextLoader(blob)
  const txtDocuments = await txtLoader.load()
  return txtDocuments
}

const getJsonFileDocuments = async (fileURLs: string[]): Promise<Document[]> => {
  const jsonFileBuffers: Buffer[] = []
  const jsonFileURLs = fileURLs.filter((url) => url.toLowerCase().endsWith('.json'))

  for (const fileURL of jsonFileURLs) {
    const response = await fetch(fileURL)
    if (!response.ok) {
      throw new Error(`Network response was not ok for file: ${fileURL}`)
    }
    const arrayBuffer = await response.arrayBuffer()
    const fileAsBuffer = Buffer.from(arrayBuffer)
    jsonFileBuffers.push(fileAsBuffer)
  }

  const blob = new Blob(jsonFileBuffers, { type: 'application/json' })
  const jsonLoader = new JSONLoader(blob)
  const jsonDocuments = await jsonLoader.load()
  return jsonDocuments
}

// Source: https://github.com/langchain-ai/langchain-nextjs-template/blob/main/app/retrieval/page.tsx
export async function POST(req: NextRequest) {
  try {
    const {
      fileURLs,
      messages,
    }: {
      fileURLs: string[]
      messages: Message[]
    } = await req.json()

    const previousMessages = messages.slice(0, -1)
    const currentMessageContent = messages[messages.length - 1].content

    const model = new ChatOpenAI({
      modelName: MODELS.gpt4,
      temperature: 0.2,
    })

    const embeddings = new OpenAIEmbeddings()

    const txtFileDocuments = await getTxtFileDocuments(fileURLs)
    const jsonFileDocuments = await getJsonFileDocuments(fileURLs)

    const vectorStore = await MemoryVectorStore.fromDocuments(
      [...txtFileDocuments, ...jsonFileDocuments],
      embeddings,
    )

    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      model,
      new StringOutputParser(),
    ])

    let resolveWithDocuments: (value: Document[]) => void

    const documentPromise = new Promise<Document[]>((resolve) => {
      resolveWithDocuments = resolve
    })

    const retriever = vectorStore.asRetriever({
      callbacks: [
        {
          handleRetrieverEnd(documents) {
            resolveWithDocuments(documents)
          },
        },
      ],
    })

    const retrievalChain = retriever.pipe(combineDocumentsFn)

    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([(input) => input.question, retrievalChain]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
      },
      answerPrompt,
      model,
    ])

    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history,
      },
      answerChain,
      new BytesOutputParser(),
    ])

    const stream = await conversationalRetrievalQAChain.stream({
      question: currentMessageContent,
      chat_history: formatVercelMessages(previousMessages),
    })

    const documents = await documentPromise
    const serializedSources = Buffer.from(
      JSON.stringify(
        documents.map((doc) => {
          return {
            pageContent: doc.pageContent.slice(0, 50) + '...',
            metadata: doc.metadata,
          }
        }),
      ),
    ).toString('base64')

    return new StreamingTextResponse(stream, {
      headers: {
        'x-message-index': (previousMessages.length + 1).toString(),
        'x-sources': serializedSources,
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
