import type { ITransferDTO, ITransferResponseDTO } from '#domain/interfaces/IApiController'
import type { ICustomer, IWallet } from '#domain/interfaces/IEntities'

export interface ICustomerService {
  getCustomer(id: string): Promise<ICustomer>
  saveCustomer(customer: ICustomer): Promise<ICustomer>
}

export interface IWalletService {
  getWallet(customerId: string): Promise<IWallet>
  saveWallet(wallet: IWallet, customerId: string): Promise<IWallet>
}

export interface ITransferService {
  transfer(transferDto: ITransferDTO): Promise<ITransferResponseDTO>
}

export interface IAuthorizerExternalService {
  authorizeTransaction(transferDto: ITransferDTO): Promise<void>
}
