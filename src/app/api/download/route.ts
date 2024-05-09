import { NextRequest, NextResponse } from 'next/server'

import { downloadRemoteStream } from '@/lib/utils/api'

// Set 'edge' runtime for production deployment with Vercel Functions
// Set 'nodejs' runtime for development
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url') as string

  const stream = await downloadRemoteStream(url)

  const response = new ReadableStream({
    start(controller) {
      stream.on('data', (chunk: any) => controller.enqueue(chunk))
      stream.on('end', () => controller.close())
    },
  })

  return new NextResponse(response, {
    headers: { 'Content-Type': 'video/mp4' },
  })
}
