export interface IErrorResponse<M, C> {
  statusCode: number
  message: M
  context?: C
}
