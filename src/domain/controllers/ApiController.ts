import { autoInjectable, delay, inject } from 'tsyringe'
import { customerIdValidation, transferValidation } from '#domain/controllers/validation'
import {
  type HttpResponse,
  HttpStatusCode,
  type ITransferDTO,
  type ITransferResponseDTO,
} from '#domain/interfaces/IApiController'
import type { ICustomer } from '#domain/interfaces/IEntities'
import type { ICustomerRequestDTO } from '#domain/interfaces/IRequestResponseDTOs'
import { CustomerRequestDTO } from '#domain/interfaces/IRequestResponseDTOs'
import { CustomerService } from '#domain/services/CustomerService'
import { TransferService } from '#domain/services/TransferService'

@autoInjectable()
export class ApiController {
  private customerService: CustomerService
  private transferService: TransferService
  constructor(
    @inject(delay(() => CustomerService))
    customerService: CustomerService,
    @inject(delay(() => TransferService))
    transferService: TransferService,
  ) {
    this.customerService = customerService
    this.transferService = transferService
  }
  async postCustomer(customer: ICustomerRequestDTO): Promise<HttpResponse<ICustomer>> {
    // TODO: Handle password
    const validatedCustomer = CustomerRequestDTO.create(customer).mapToICustomer()
    const customerSaved = await this.customerService.saveCustomer(validatedCustomer)
    return {
      statusCode: HttpStatusCode.CREATED,
      body: customerSaved,
    }
  }
  async getCustomer(id: string): Promise<HttpResponse<ICustomer>> {
    const customerId = customerIdValidation.parse(id)
    const customer = await this.customerService.getCustomer(customerId)
    return {
      statusCode: HttpStatusCode.OK,
      body: customer,
    }
  }
  async postTransfer(transferDTO: ITransferDTO): Promise<HttpResponse<ITransferResponseDTO>> {
    const transferBody = transferValidation.parse(transferDTO)
    const transfer = await this.transferService.transfer(transferBody)
    return {
      statusCode: HttpStatusCode.OK,
      body: transfer,
    }
  }
}
