import { del } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  const {
    url,
    blobToken,
  }: {
    url: string
    blobToken?: string
  } = await req.json()

  try {
    const token = blobToken ?? process.env.BLOB_READ_WRITE_TOKEN

    await del(url, { token })

    return NextResponse.json({ deletedUrl: url })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 })
  }
}
