import type { ICustomer, ITransfer, IWallet } from '#domain/interfaces/IEntities'

export interface ICustomerRepository {
  find(id: ICustomer['id']): Promise<ICustomer>
  create(customer: ICustomer): Promise<ICustomer>
}

export interface IWalletRepository {
  create(wallet: IWallet, customer_id: string): Promise<IWallet>
  find(customer_id: string): Promise<IWallet>
  debit(customerId: string, value: number): Promise<void>
  credit(customerId: string, value: number): Promise<void>
}

export interface ITransferRepository {
  create(transferDto: ITransfer): Promise<ITransfer>
}
