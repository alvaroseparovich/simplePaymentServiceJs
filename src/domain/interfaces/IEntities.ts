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

export interface ITransfer {
  id?: string
  status: ITransferStatus
  value: number
  fromWallet: string
  toWallet: string
  createdAt: Date
}

export enum ITransferStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  DENIED = 'DENIED',
}
