import { customerIdValidation, transferValidation } from '#domain/controllers/validation'
import type { IApiController, ITransferDTO, ITransferResponseDTO } from '#domain/interfaces/IApiController'
import type { ICustomer } from '#domain/interfaces/IEntities'
import type { ICustomerRequestDTO } from '#domain/interfaces/IRequestResponseDTOs'
import { CustomerRequestDTO } from '#domain/interfaces/IRequestResponseDTOs'
import type { ICustomerService } from '#domain/interfaces/IServices'

export class ApiController implements IApiController {
  private customerService: ICustomerService
  constructor(customerService: ICustomerService) {
    this.customerService = customerService
  }
  async postCustomer(customer: ICustomerRequestDTO): Promise<ICustomer> {
    // TODO: Handle password
    const validatedCustomer = CustomerRequestDTO.create(customer).mapToICustomer()
    return await this.customerService.saveCustomer(validatedCustomer)
  }
  async getCustomer(id: string): Promise<ICustomer> {
    const customerId = customerIdValidation.parse(id)
    return await this.customerService.getCustomer(customerId)
  }
  postTransfer(transferDTO: ITransferDTO): ITransferResponseDTO {
    const transferBody = transferValidation.parse(transferDTO)

    return {} as ITransferResponseDTO
  }
}
