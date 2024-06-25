import type { ICustomer, IWallet } from '#domain/interfaces/IEntities'

export interface ICustomerRepository {
  find(id: ICustomer['id']): ICustomer
  create(customer: ICustomer): Promise<ICustomer>
  // update(customer: ICustomer): ICustomer
}

export interface IWalletRepository {
  create(wallet: IWallet, customer_id: string): Promise<IWallet>
  // find(id: IWallet[''])
}
