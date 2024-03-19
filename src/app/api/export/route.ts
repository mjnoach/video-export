import { NextResponse } from 'next/server'

import { BadRequest, NotFound } from './errors'

import ky from 'ky'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const data: Clip = await request.json()
  console.log('🚀 ~ POST ~ data:', data)
  try {
    const res = await ky.post('http://localhost:3001/export', {
      json: data,
    })
    const id = await res.json<ExportedObj['id']>()
    return NextResponse.json(id)
  } catch (e) {
    if (e instanceof Error) console.error(e.name, e.message, e.cause)
    return new NextResponse(
      `Failed submitting export data for source video ${data.sourceVideo.url}`,
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  console.log('🚀 ~ GET ~ id:', id)

  if (!id) throw new BadRequest(`Task id must be provided`)

  try {
    const res = await ky.get(`http://localhost:3001/export/${id}`)
    return new NextResponse(res.body)
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
