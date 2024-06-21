import { Router } from 'express'
import type { IApiController } from '#domain/interfaces/IApiController'

export class ApiRouterExpress {
  private apiController: IApiController
  router: Router
  constructor(apiController: IApiController) {
    this.apiController = apiController
    this.router = Router()
    this.startRoutes()
  }

  private startRoutes() {
    this.router.get('/customer/:customerId', (req, res) => {
      res.json(this.apiController.getCustomer(req.params.customerId))
    })

    this.router.post('/customer', (req, res) => {
      res.json(this.apiController.postCustomer(req.body || {}))
    })

    this.router.post('/transfer', (req, res) => {
      res.json(this.apiController.postTransfer(req.body || {}))
    })
  }
}
