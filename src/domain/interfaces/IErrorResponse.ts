import type { HttpResponse } from '#domain/interfaces/IApiController'

export interface IErrorResponse<T, C> extends HttpResponse<T> {
  context?: C
}
