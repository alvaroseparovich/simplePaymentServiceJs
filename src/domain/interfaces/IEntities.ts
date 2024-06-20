export interface ICustomer {
  id?: number
  name: string
  document: string
  email: string
  wallet: IWallet
}

export interface IWallet {
  type: IWalletTypes
  balance?: number
}

export enum IWalletTypes {
  CUSTOMER = 'CUSTOMER',
  COMPANY = 'COMPANY',
}
