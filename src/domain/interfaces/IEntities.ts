export interface ICustomer {
  id?: string
  name: string
  document: string
  email: string
  wallet?: IWallet
}

export interface IWallet {
  id?: string
  customer_id?: string
  type: IWalletTypes
  balance?: number
}

export enum IWalletTypes {
  CUSTOMER = 'CUSTOMER',
  COMPANY = 'COMPANY',
}
