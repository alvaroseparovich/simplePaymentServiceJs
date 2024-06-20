import type { ICustomer } from './IEntities'

export interface ICustomerService {
  getCustomer(id: number): ICustomer
  saveCustomer(customer: ICustomer): ICustomer
}
