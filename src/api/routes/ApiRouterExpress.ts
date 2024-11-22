import { Router } from 'express'
import { autoInjectable, delay, inject } from 'tsyringe'
import { ApiController } from '#domain/controllers/ApiController'

@autoInjectable()
export class ApiRouterExpress {
  private apiController: ApiController
  router: Router
  constructor(
    @inject(delay(() => ApiController))
    apiController: ApiController,
  ) {
    this.apiController = apiController
    this.router = Router()
    this.startRoutes()
  }

  private startRoutes() {
    this.router.get('/customer/:customerId', async (req, res) => {
      const response = await this.apiController.getCustomer(req.params.customerId)
      res.status(response.statusCode).json(response.body)
    })

    this.router.post('/customer', async (req, res) => {
      const customer = await this.apiController.postCustomer(req.body || {})
      res.status(customer.statusCode).json(customer.body)
    })

    this.router.post('/transfer', async (req, res) => {
      const transfer = await this.apiController.postTransfer(req.body || {})
      res.status(transfer.statusCode).json(transfer.body)
    })
  }
}
