import { NextResponse } from 'next/server'

import { downloadClip } from '@/lib/download'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const data: Clip = await request.json()
  console.log('🚀 ~ POST ~ data:', data)
  try {
    // throw new Error('test')
    const exportedObj = await downloadClip(data)
    return NextResponse.json(exportedObj)
  } catch (e) {
    const msg = `Failed downloading a clip from source: ${data.sourceVideo.url}`
    console.error(msg)
    return new NextResponse(msg, { status: 500 })
  }
}
