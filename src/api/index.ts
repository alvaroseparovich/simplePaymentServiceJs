import ApiExpress from '#api/ApiExpress'
import ErrorHandler from '#api/errors/ErrorHandler'
import { ApiRouterExpress } from '#api/routes/ApiRouterExpress'
import { ApiController } from '#domain/controllers/ApiController'
import { ApiErrorHandler } from '#domain/errors/ApiErroHandler'
import { CustomerService } from '#domain/services/CustomerService'
import { WalletService } from '#domain/services/WalletService'
import { CustomerRepository } from '#infrastructure/database/repositories/CustomerRepository'
import { WalletRepository } from '#infrastructure/database/repositories/WalletRepository'

const customerService = new CustomerService(new CustomerRepository(), new WalletService(new WalletRepository()))

const apiController = new ApiController(customerService)

const apiRouterExpress = new ApiRouterExpress(apiController)
const api = new ApiExpress(apiRouterExpress.router, new ErrorHandler(new ApiErrorHandler()), 8080)

api.start()
