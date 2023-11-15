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
      selectedFeature,
    }: {
      messages: ChatCompletionMessageParam[]
      model: string
      role: string
      apiKey: string
      selectedFeature: string
    } = await req.json()

    if (apiKey) {
      openai.apiKey = apiKey
    } else {
      openai.apiKey = process.env.OPENAI_API_KEY || ''
    }

    if (selectedFeature === 'chat') {
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
    } else if (selectedFeature === 'image generation') {
      const prompt = messages[messages.length - 1].content || 'Horse on a ball'
      const response = await openai.images.generate({
        prompt: prompt.toString(),
        n: 1,
        size: '1024x1024',
        model: 'dall-e-3',
      })

      return NextResponse.json(response)
    } else {
      throw new Error(`Unsupported selected feature: ${selectedFeature}`)
    }
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error
      return NextResponse.json({ name, status, headers, message }, { status })
    }

    throw error
  }
}
