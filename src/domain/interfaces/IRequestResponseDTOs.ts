import { customerRequestDTOValidation } from '#domain/controllers/validation'
import type { ICustomer, IWallet } from '#domain/interfaces/IEntities'

export interface ICustomerRequestDTO {
  name: string
  document: string
  email: string
  wallet: IWallet
  password: string
}

export class CustomerRequestDTO implements ICustomerRequestDTO {
  name: string
  document: string
  email: string
  wallet: IWallet
  password: string

  constructor(customerRequestDTO: ICustomerRequestDTO) {
    this.name = customerRequestDTO.name
    this.document = customerRequestDTO.document
    this.email = customerRequestDTO.email
    this.wallet = customerRequestDTO.wallet
    this.password = customerRequestDTO.password
  }

  static create(customerRequestDTO: ICustomerRequestDTO) {
    const validated = customerRequestDTOValidation.parse(customerRequestDTO)
    return new CustomerRequestDTO(validated)
  }

  mapToICustomer(): ICustomer {
    const { name, document, email, wallet } = this
    return {
      name,
      document,
      email,
      wallet,
    }
  }
}
