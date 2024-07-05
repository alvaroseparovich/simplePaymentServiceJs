import ApiExpress from '#api/ApiExpress'
import ErrorHandler from '#api/errors/ErrorHandler'
import { ApiRouterExpress } from '#api/routes/ApiRouterExpress'
import { ApiController } from '#domain/controllers/ApiController'
import { ApiErrorHandler } from '#domain/errors/ApiErroHandler'
import { CustomerService } from '#domain/services/CustomerService'
import { TransferService } from '#domain/services/TransferService'
import { WalletService } from '#domain/services/WalletService'
import { CustomerRepository } from '#infrastructure/database/repositories/CustomerRepository'
import { TransferRepository } from '#infrastructure/database/repositories/TransferRepository'
import { WalletRepository } from '#infrastructure/database/repositories/WalletRepository'
import { AuthorizerExternal } from '#outsource-services/AuthorizerExternal'

const walletRepository = new WalletRepository()
const customerRepository = new CustomerRepository()
const transferRepository = new TransferRepository(walletRepository)

const walletService = new WalletService(walletRepository)
const customerService = new CustomerService(customerRepository, walletService)
const authorizerExternal = new AuthorizerExternal()
const transferService = new TransferService(transferRepository, customerService, authorizerExternal)

const apiController = new ApiController(customerService, transferService)

const apiRouterExpress = new ApiRouterExpress(apiController)
const api = new ApiExpress(apiRouterExpress.router, new ErrorHandler(new ApiErrorHandler()), 8080)

api.start()
