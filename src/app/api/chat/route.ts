import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import type { CoreMessage } from 'ai'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const {
      messages,
      model,
      role,
      apiKey,
    }: {
      messages: CoreMessage[]
      model: string
      role: string
      apiKey: string
    } = await req.json()

    const openai = createOpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY || '',
    })

    const result = streamText({
      model: openai(model),
      messages: [
        {
          role: 'system',
          content: role,
        },
        ...messages,
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 },
    )
  }
}
