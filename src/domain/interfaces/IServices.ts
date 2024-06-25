import type { ICustomer, IWallet } from './IEntities'

export interface ICustomerService {
  getCustomer(id: string): Promise<ICustomer>
  saveCustomer(customer: ICustomer): Promise<ICustomer>
}

export interface IWalletService {
  getWallet(customer_id: string): Promise<IWallet>
  saveWallet(wallet: IWallet, customer_id: string): Promise<IWallet>
}
