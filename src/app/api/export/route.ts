import { NextResponse } from 'next/server'

import { errorResponse } from '@/lib/utils/errors'
import { assertMaxDuration } from '@/lib/validation'

import ky, { Options } from 'ky'

const { API_URL, API_RUNTIME, MAX_CLIP_DURATION } = process.env

// Set 'edge' runtime for production deployment with Vercel Functions
// Set 'nodejs' runtime for development
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const options = {} as Options
    let clip: Clip
    const isClientUpload = request.headers
      .get('Content-Type')
      ?.includes('multipart/form-data')
    if (isClientUpload) {
      const formData = await request.formData()
      clip = JSON.parse(formData.get('clip') as string) as Clip
      assertMaxDuration(clip, Number(MAX_CLIP_DURATION))
      options.body = formData
    } else {
      const clip: Clip = await request.json()
      assertMaxDuration(clip, Number(MAX_CLIP_DURATION))
      options.json = clip
    }
    const res = await ky.post(`${API_URL}/export`, options)
    const id = await res.json<ExportData['id']>()
    return NextResponse.json(id)
  } catch (e: any) {
    console.error(e)
    return errorResponse(
      { message: `Error initializing export`, status: 500 },
      e
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  try {
    if (!id)
      return errorResponse({ message: `Task id must be provided`, status: 400 })
    const res = await ky.get(`${API_URL}/export/${id}`)
    const stream = res.body
    return new NextResponse(stream)
  } catch (e) {
    console.error(e)
    return errorResponse(
      { message: `Failed streaming data for export ${id}`, status: 500 },
      e
    )
  }
}
