import ApiExpress from '#api/ApiExpress'
import ErrorHandler from '#api/errors/ErrorHandler'
import { ApiRouterExpress } from '#api/routes/ApiRouterExpress'
import { ApiController } from '#domain/controllers/ApiController'
import { ApiErrorHandler } from '#domain/errors/ApiErroHandler'

const apiRouterExpress = new ApiRouterExpress(new ApiController())
const api = new ApiExpress(apiRouterExpress.router, new ErrorHandler(new ApiErrorHandler()), 8080)

api.start()
