import { OpenAIStream, StreamingTextResponse } from 'ai'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

const openai = new OpenAI()

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const {
      messages,
      model,
      role,
      apiKey,
    }: { messages: ChatCompletionMessageParam[]; model: string; role: string; apiKey: string } =
      await req.json()

    if (apiKey) {
      openai.apiKey = apiKey
    } else {
      openai.apiKey = process.env.OPENAI_API_KEY || ''
    }

    const response = await openai.chat.completions.create({
      model,
      stream: true,
      messages: [
        {
          role: 'system',
          content: role,
        },
        ...messages,
      ],
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error
      return NextResponse.json({ name, status, headers, message }, { status })
    }

    throw error
  }
}
