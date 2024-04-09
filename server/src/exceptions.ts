import { HTTPException } from 'hono/http-exception'

export class SourceException extends HTTPException {
  constructor(message: string, cause: Error) {
    super(400, { message, cause })
  }
}

export class NotFoundException extends HTTPException {
  constructor(id: string) {
    super(404, { message: `Export '${id}' not found` })
  }
}

export class TranscodingException extends HTTPException {
  constructor(id: string, cause?: Error) {
    super(424, { message: `Transcoding '${id}' failed`, cause })
  }
}

export class ExportException extends HTTPException {
  constructor(id: string) {
    super(424, { message: `Exporting '${id}' failed` })
  }
}

// export class UnknownException extends HTTPException {
//   constructor(id: string, message?: string) {
//     super(500, { message: 'Internal server error' })
//   }
// }
