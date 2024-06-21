import { customerIdValidation, customerValidation, transferValidation } from '#domain/controllers/validation'
import type { IApiController, ITransferDTO, ITransferResponseDTO } from '#domain/interfaces/IApiController'
import type { ICustomer } from '#domain/interfaces/IEntities'

export class ApiController implements IApiController {
  private customer?: ICustomer
  postCustomer(customer: ICustomer): ICustomer {
    this.customer = customerValidation.parse(customer)

    return this.customer as ICustomer
  }
  getCustomer(id: number | string): ICustomer {
    const customerId = customerIdValidation.parse(id)

    return this.customer || ({} as ICustomer)
  }
  postTransfer(transferDTO: ITransferDTO): ITransferResponseDTO {
    const transferBody = transferValidation.parse(transferDTO)

    return {} as ITransferResponseDTO
  }
}
