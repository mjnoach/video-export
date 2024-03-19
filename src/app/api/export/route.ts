import { NextResponse } from 'next/server'

import { taskManager } from '../task-manager'
import { downloadClip } from './download'
import { BadRequest, NotFound } from './errors'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const data: Clip = await request.json()
  console.log('🚀 ~ POST ~ data:', data)
  try {
    const { id } = taskManager.initializeTask()
    downloadClip(id, data)

    return NextResponse.json(id)
  } catch (e) {
    if (e instanceof Error) console.error(e.name, e.message, e.cause)
    return new NextResponse(
      `Failed downloading a clip from source: ${data.sourceVideo.url}`,
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) throw new BadRequest(`Task id must be provided`)

  try {
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    const task = taskManager.getTask(id)
    if (!task) throw new NotFound(id)

    task.callbacks = {
      onProgress: (progress) => {
        writer.write(progress)
      },
      onFinish: (obj) => {
        writer.write(`data:${JSON.stringify(obj)}`)
        writer.close()
      },
      onError: () => {
        writer.close()
      },
    }

    return new NextResponse(stream.readable)
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
