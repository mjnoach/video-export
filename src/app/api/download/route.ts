import { NextRequest, NextResponse } from 'next/server'

import ytdl from 'ytdl-core'

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

async function downloadRemoteStream(url: string) {
  try {
    const info = await ytdl.getInfo(url)
    // printFormatsInfo(info)
    const format = ytdl.chooseFormat(info.formats, {
      // TODO
      // remove quality limitations after server resouces have been increased
      filter: (f) =>
        ['webm', 'mp4'].includes(f.container) &&
        f.qualityLabel === '360p' &&
        f.hasAudio,
    })
    return ytdl(url, {
      format,
    }).on('progress', (_current, downloaded, total) => {
      const fraction = downloaded / total
      const percent = (fraction * 100).toFixed(0)
      console.log('🚀 ~ downloadRemoteSource ~ percent:', percent)
    })
  } catch (e: any) {
    throw new Error(`Failed downloading stream from source ${url}`, e)
  }
}
