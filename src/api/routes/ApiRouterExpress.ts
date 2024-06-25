import { Router } from 'express'
import { HttpStatusCode, type IApiController } from '#domain/interfaces/IApiController'

export class ApiRouterExpress {
  private apiController: IApiController
  router: Router
  constructor(apiController: IApiController) {
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

    this.router.post('/transfer', (req, res) => {
      res.status(HttpStatusCode.NOT_IMPLEMENTED).json(this.apiController.postTransfer(req.body || {}))
    })
  }
}
