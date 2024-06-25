import { ZodError } from 'zod'
import type { IApiErrorHandler } from '#domain/interfaces/IApiErrorHandlers'
import type { IErrorResponse } from '#domain/interfaces/IErrorResponse'

export class ApiErrorHandler implements IApiErrorHandler {
  private _handlers = {
    [ZodError.name]: (error: Error) => {
      const zodError = error as ZodError
      return {
        statusCode: 400,
        message: 'Payload validation error',
        context: zodError.issues,
      }
    },
  }

  handle(error: Error): IErrorResponse<string, object> {
    console.log(error.name)
    if (Object.keys(this._handlers).includes(error.name)) {
      console.log('tem aqui nessa lista')
      return this._handlers[error.name](error)
    }

    console.log('Nao tem aqui nessa lista', error)
    return {
      statusCode: 500,
      message: 'Unexpected Error Ocurred',
    }
  }
}
