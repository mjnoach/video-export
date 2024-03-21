import { NextResponse } from 'next/server'

import { BadRequest, NotFound } from './errors'

import ky from 'ky'

export const dynamic = 'force-dynamic'

const { API_URL } = process.env

export async function POST(request: Request) {
  const data: Clip = await request.json()
  console.log('🚀 ~ POST /export ~ data:', data)

  try {
    const res = await ky.post(`${API_URL}/export`, {
      json: data,
    })
    const id = await res.json<ExportedObj['id']>()
    return NextResponse.json(id)
  } catch (e) {
    if (e instanceof Error) console.error(e.name, e.message, e.cause)
    return new NextResponse(
      `Error initializing export from source ${data.sourceVideo}`,
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  console.log('🚀 ~ GET /export ~ id:', id)

  try {
    if (!id) throw new BadRequest(`Task id must be provided`)
    const res = await ky.get(`${API_URL}/export/${id}`)
    const stream = res.body
    return new NextResponse(stream)
  } catch (e) {
    if (e instanceof Error) console.error(e.name, e.message, e.cause)
    if (e instanceof BadRequest)
      return new NextResponse(e.message, { status: 400 })
    if (e instanceof NotFound)
      return new NextResponse(e.message, { status: 404 })
    return new NextResponse(`Failed streaming data for export ${id}`, {
      status: 500,
    })
  }
}
