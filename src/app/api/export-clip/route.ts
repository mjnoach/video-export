import { NextResponse } from 'next/server'

import { downloadClip } from '@/lib/download'
import { rewriteFileMetadata } from '@/lib/ffmpeg'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const data: Clip = await request.json()
  console.log('🚀 ~ POST ~ data:', data)
  const { sourceVideo, start, end } = data

  try {
    const { filePath, fileName } = await downloadClip(data, {
      onFinish: () => {
        rewriteFileMetadata(filePath)
      },
    })
    return NextResponse.json({ fileName, filePath })
  } catch (e) {
    const msg = `Failed downloading a clip from source: ${data.sourceVideo}`
    console.error(msg)
    return new NextResponse(msg, { status: 500 })
  }
}
