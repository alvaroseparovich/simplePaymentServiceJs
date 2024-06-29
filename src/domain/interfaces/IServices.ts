import type { ITransferDTO, ITransferResponseDTO } from '#domain/interfaces/IApiController'
import type { ICustomer, IWallet } from '#domain/interfaces/IEntities'

export interface ICustomerService {
  getCustomer(id: string): Promise<ICustomer>
  saveCustomer(customer: ICustomer): Promise<ICustomer>
}

export interface IWalletService {
  getWallet(customer_id: string): Promise<IWallet>
  saveWallet(wallet: IWallet, customer_id: string): Promise<IWallet>
  debit(walletId: string, value: number): Promise<void>
  credit(walletId: string, value: number): Promise<void>
}

export interface ITransferService {
  transfer(transferDto: ITransferDTO): Promise<ITransferResponseDTO>
}

export interface IAuthorizerExternalService {
  authorizeTransaction(transferDto: ITransferDTO): Promise<void>
}
