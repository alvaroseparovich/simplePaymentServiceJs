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
import type { ICustomerService } from '#domain/interfaces/IServices'

export class ApiController implements IApiController {
  private customerService: ICustomerService
  constructor(customerService: ICustomerService) {
    this.customerService = customerService
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
  postTransfer(transferDTO: ITransferDTO): ITransferResponseDTO {
    const transferBody = transferValidation.parse(transferDTO)

    return {} as ITransferResponseDTO
  }
}
