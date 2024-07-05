import { ZodError } from 'zod'
import type { ApiError } from '#domain/errors/Exceptions'
import type { IApiErrorHandler } from '#domain/interfaces/IApiErrorHandlers'
import type { IErrorResponse } from '#domain/interfaces/IErrorResponse'

export class ApiErrorHandler implements IApiErrorHandler {
  private _third_party_handlers = {
    [ZodError.name]: (error: Error) => {
      const zodError = error as ZodError
      return {
        statusCode: 400,
        body: 'Payload validation error',
        context: zodError.issues,
      }
    },
  }

  handle(error: Error & Partial<ApiError>): IErrorResponse<string, object> {
    console.log('Error not expected', error)
    if (error.statusCode) {
      return {
        statusCode: error.statusCode,
        body: error.message,
        context: error.context,
      }
    }

    if (Object.keys(this._third_party_handlers).includes(error.name)) {
      return this._third_party_handlers[error.name](error)
    }

    return {
      statusCode: 500,
      body: 'Unexpected Error Ocurred',
    }
  }
}
