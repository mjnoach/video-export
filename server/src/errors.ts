export class NotFound extends Error {
  constructor(id: string) {
    super()
    this.name = 'NotFound'
    this.message = `Task ${id} was not found`
    Object.setPrototypeOf(this, NotFound.prototype)
  }
}

export class BadRequest extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BadRequest'
    Object.setPrototypeOf(this, BadRequest.prototype)
  }
}
