import type { IErrorResponse } from '#domain/interfaces/IErrorResponse'

export interface IApiErrorHandler {
  handle(error: Error): IErrorResponse<string, object>
}
