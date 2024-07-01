import express from 'express'
import 'express-async-errors'
import type { Application, NextFunction, Request, Response, Router } from 'express'
import type ErrorHandler from '#api/errors/ErrorHandler'

export default class ApiExpress {
  framework: Application
  router: Router
  errorHandler: ErrorHandler
  httpPort: number
  constructor(router: Router, errorHandler: ErrorHandler, httpPort = 8080) {
    this.framework = express()
    this.router = router
    this.errorHandler = errorHandler
    this.httpPort = httpPort
  }
  start() {
    // Use Json on this router
    this.framework.use(express.json())

    // Log all requests
    this.framework.use((req, res, next) => {
      console.log(`/${req.method} ${req.url}`, req.body)
      next()
    })

    // Start all routes
    this.framework.use('/', this.router)

    // Catch Any errors
    this.framework.use((error: Error, request: Request, response: Response, next: NextFunction) => {
      this.errorHandler.handle(error, request, response)
      next()
    })

    // Start Server
    this.framework.listen(this.httpPort, () => {
      console.log('Example app listening on port 8080!')
      console.log(process.env.PORT)
    })
  }
}
