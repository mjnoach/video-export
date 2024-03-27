import { HTTPException } from 'hono/http-exception'

export const ProcessingException = (e: any) =>
  new HTTPException(500, {
    message: 'Task processing error',
    cause: e,
  })

export const StreamingException = (e: any) =>
  new HTTPException(500, {
    message: 'Streaming error occured',
    cause: e,
  })

export const DownloadException = (e: any, source: string) =>
  new HTTPException(500, {
    message: `Error downloading video stream from source ${source}`,
    cause: e,
  })

export const TaskNotFoundException = (id: string) =>
  new HTTPException(404, {
    message: `Task for export '${id}' not found`,
  })
