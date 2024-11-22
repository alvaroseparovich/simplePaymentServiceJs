import 'reflect-metadata'
import { container } from 'tsyringe'
import ApiExpress from '#api/ApiExpress'
import ErrorHandler from '#api/errors/ErrorHandler'
import { ApiRouterExpress } from '#api/routes/ApiRouterExpress'
import { ApiErrorHandler } from '#domain/errors/ApiErroHandler'

const apiRouterExpress = container.resolve(ApiRouterExpress)
const api = new ApiExpress(apiRouterExpress.router, new ErrorHandler(new ApiErrorHandler()), 8080)

api.start()
