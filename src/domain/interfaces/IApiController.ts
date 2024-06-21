import type { ICustomer } from '#domain/interfaces/IEntities'

export interface IApiController {
  postCustomer(customer: ICustomer): ICustomer
  getCustomer(id: ICustomer['id'] | string): ICustomer
  postTransfer(transferDTO: ITransferDTO): ITransferResponseDTO
}

export interface ITransferDTO {
  value: number
  payer: ICustomer['id']
  payee: ICustomer['id']
}

export interface ITransferResponseDTO extends ITransferDTO {
  success: boolean
  createdAt: Date
}
