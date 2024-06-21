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
    try {
      console.log(error.name)
      return this._handlers[error.name](error)
    } catch (err) {
      console.error('Unexpected Error Ocurred', err, 'Original Error', error)
      return {
        statusCode: 500,
        message: 'Unexpected Error Ocurred',
      }
    }
  }
}
