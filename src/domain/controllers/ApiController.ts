import { customerIdValidation, transferValidation } from '#domain/controllers/validation'
import {
  type HttpResponse,
  HttpStatusCode,
  type IApiController,
  type ITransferDTO,
  type ITransferResponseDTO,
} from '#domain/interfaces/IApiController'
import type { ICustomer } from '#domain/interfaces/IEntities'
import type { ICustomerRequestDTO } from '#domain/interfaces/IRequestResponseDTOs'
import { CustomerRequestDTO } from '#domain/interfaces/IRequestResponseDTOs'
import type { ICustomerService, ITransferService } from '#domain/interfaces/IServices'

export class ApiController implements IApiController {
  private customerService: ICustomerService
  private transferService: ITransferService
  constructor(customerService: ICustomerService, transferService: ITransferService) {
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
