import type { ICustomer, IWallet } from '#domain/interfaces/IEntities'

export interface ICustomerRepository {
  find(id: ICustomer['id']): Promise<ICustomer>
  create(customer: ICustomer): Promise<ICustomer>
}

export interface IWalletRepository {
  create(wallet: IWallet, customer_id: string): Promise<IWallet>
  find(customer_id: string): Promise<IWallet>
}
