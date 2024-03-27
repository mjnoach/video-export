import { NextResponse } from 'next/server'

import { errorResponse } from '@/lib/utils/errors'

import ky, { Options } from 'ky'

const { API_URL } = process.env

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const options = {} as Options
    if (request.headers.get('Content-Type')?.includes('multipart/form-data')) {
      const formData = await request.formData()
      options.body = formData
    } else {
      const clip: Clip = await request.json()
      options.json = clip
    }
    const res = await ky.post(`${API_URL}/export`, options)
    const id = await res.json<ExportData['id']>()
    return NextResponse.json(id)
  } catch (e: any) {
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
      return errorResponse({ message: `Task id must be provided`, status: 404 })
    const res = await ky.get(`${API_URL}/export/${id}`)
    const stream = res.body
    return new NextResponse(stream)
  } catch (e) {
    return errorResponse(
      { message: `Failed streaming data for export ${id}`, status: 500 },
      e
    )
  }
}
