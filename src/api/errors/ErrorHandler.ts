import type { Request, Response } from 'express'
import type { IApiErrorHandler } from '#domain/interfaces/IApiErrorHandlers'

export default class ErrorHandlerExpress {
  domainErrorHandler: IApiErrorHandler

  constructor(domainErrorHandler: IApiErrorHandler) {
    this.domainErrorHandler = domainErrorHandler
  }

  handle(err: Error, req: Request, res: Response) {
    console.log(err)
    const errorResponse = this.domainErrorHandler.handle(err)

    res.status(errorResponse.statusCode).send({
      body: errorResponse.body,
      context: errorResponse.context,
    })
  }
}
