import { HTTPException } from 'hono/http-exception'

export class SourceException extends HTTPException {
  constructor(message: string) {
    super(400, { message })
  }
}

export class NotFoundException extends HTTPException {
  constructor(id: string) {
    super(404, { message: `Export task '${id}' not found` })
  }
}

export class ExportException extends HTTPException {
  constructor(id: string, message?: string) {
    super(424, { message: message || `Export task '${id}' has failed` })
  }
}

export class UnknownException extends HTTPException {
  constructor(id: string, message?: string) {
    super(500, { message: 'Internal server error' })
  }
}
