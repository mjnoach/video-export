import { HTTPException } from 'hono/http-exception'

export const UndefinedException = (e: any) =>
  new HTTPException(500, {
    message: 'Undefined error occured',
    cause: e,
  })

export const InitException = (e: any, source: string) =>
  new HTTPException(500, {
    message: `Error initializing export from source ${source}`,
    cause: e,
  })

export const NotFoundException = (id: string) =>
  new HTTPException(404, {
    message: `Export '${id}' not initialized properly`,
  })
