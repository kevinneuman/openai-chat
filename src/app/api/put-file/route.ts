import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  const form = await req.formData()
  const userId = form.get('userId')
  const blobToken = form.get('blobToken')
  const files = form.getAll('files')
  const fileNames = form.getAll('fileNames')

  if (!userId) {
    throw new Error(`userId was missing!`)
  }

  if (!files.length || !fileNames.length) {
    throw new Error(`Files were empty!`)
  }

  try {
    const token = blobToken?.toString() ?? process.env.BLOB_READ_WRITE_TOKEN

    const blobs = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileName = fileNames[i]

      const contentType = req.headers.get('content-type') || 'text/plain'
      const filename = `${userId}_${fileName}`

      const blob = await put(filename, file, {
        token,
        contentType,
        access: 'public',
      })
      blobs.push(blob)
    }

    return NextResponse.json(blobs)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 })
  }
}
