import { NextResponse } from 'next/server'

import {
  handleServerErrors,
  msgExportInitError,
  msgExportStreamingError,
} from '@/lib/utils/errors'

import ky from 'ky'

export const dynamic = 'force-dynamic'

const { API_URL } = process.env

export async function POST(request: Request) {
  const formData = await request
    .clone()
    .formData()
    .catch((e) => {})
  const clip: Clip = await request.json().catch((e) => {})
  try {
    const res = await ky.post(
      `${API_URL}/export`,
      !!formData ? { body: formData } : { json: clip }
    )
    const id = await res.json<ExportedObj['id']>()
    return NextResponse.json(id)
  } catch (e: any) {
    return handleServerErrors(e, msgExportInitError(clip.url))
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    // todo make this return invalid request intstead of default 500 response
    if (!id) throw new Error(`Task id must be provided`)
    const res = await ky.get(`${API_URL}/export/${id}`)
    const stream = res.body
    return new NextResponse(stream)
  } catch (e) {
    return handleServerErrors(e, msgExportStreamingError(`${id}`))
  }
}
