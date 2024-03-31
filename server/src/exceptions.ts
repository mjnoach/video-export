import { HTTPException } from 'hono/http-exception'

export class SourceException extends HTTPException {
  constructor(message: string) {
    super(400, { message })
  }
}

export class NotFoundException extends HTTPException {
  constructor(id: string) {
    super(404, { message: `Export '${id}' not found` })
  }
}

export class ExportException extends HTTPException {
  constructor(id: string, message?: string, cause?: Error) {
    super(424, { message: message || `Export '${id}' has failed`, cause })
  }
}

export class UnknownException extends HTTPException {
  constructor(id: string, message?: string) {
    super(500, { message: 'Internal server error' })
  }
}
