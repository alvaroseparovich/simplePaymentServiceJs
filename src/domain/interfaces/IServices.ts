import type { ICustomer, IWallet } from './IEntities'

export interface ICustomerService {
  // getCustomer(id: number): ICustomer
  saveCustomer(customer: ICustomer): Promise<ICustomer>
}

export interface IWalletService {
  saveWallet(wallet: IWallet, customer_id: string): Promise<IWallet>
}
