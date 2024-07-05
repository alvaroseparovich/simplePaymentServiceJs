import type { PoolClient } from 'pg'
import type { ICustomer, ITransfer, ITransferStatus, IWallet } from '#domain/interfaces/IEntities'

export interface ICustomerRepository {
  find(id: ICustomer['id']): Promise<ICustomer>
  create(customer: ICustomer): Promise<ICustomer>
}

export interface IWalletRepository {
  create(wallet: IWallet, customer_id: string): Promise<IWallet>
  find(customer_id: string): Promise<IWallet>
  debit(customerId: string, value: number, db: PoolClient): Promise<void>
  credit(customerId: string, value: number, db: PoolClient): Promise<void>
  getAndLockBalance(customer_id: string, db: PoolClient): Promise<number>
}

export interface ITransferRepository {
  find(id: string): Promise<ITransfer>
  create(transferDto: ITransfer): Promise<void>
  createFailedTransfer(
    transferDto: ITransfer,
    status: ITransferStatus.DENIED | ITransferStatus.FAILED,
  ): Promise<ITransfer>
}
