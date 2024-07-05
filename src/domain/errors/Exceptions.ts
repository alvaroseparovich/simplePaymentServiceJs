export class ApiError extends Error {
  public readonly statusCode: number
  public readonly context?: object
  constructor(message: string, statusCode: number, context?: object) {
    super(message)
    this.statusCode = statusCode
    this.context = context
  }
}

export class EntityNotFound extends ApiError {
  constructor(entityName: string, id: string) {
    super(`Entity [${entityName}] with id [${id}] Not Found`, 404)
  }
}

export class RepositoryError extends ApiError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class TransferDeniedError extends ApiError {
  constructor(message: string) {
    super(message, 400)
  }
}
