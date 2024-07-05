import type { DatabaseError } from 'pg'
import { ApiError, EntityNotFound, RepositoryError, TransferDeniedError } from '#domain/errors/Exceptions'
import { type ITransfer, ITransferStatus } from '#domain/interfaces/IEntities'
import type { ITransferRepository, IWalletRepository } from '#domain/interfaces/IRepositories'
import { database } from '#infrastructure/database/configs/postgressDriver'
import type { Database } from '#infrastructure/database/configs/postgressDriver'

export class TransferRepository implements ITransferRepository {
  private database: Database
  private walletRepository: IWalletRepository

  constructor(walletRepository: IWalletRepository, db = database) {
    this.database = db
    this.walletRepository = walletRepository
  }

  async create(transfer: ITransfer): Promise<void> {
    const transaction = await this.database.getTransactionPool()
    try {
      await transaction.query('BEGIN')

      const balance = await this.walletRepository.getAndLockBalance(transfer.fromWallet, transaction)
      console.log('BALANCE ! -', balance)

      if (balance < transfer.value) {
        throw new TransferDeniedError('No suficient funds')
      }
      await this.walletRepository.debit(transfer.fromWallet, transfer.value, transaction)
      await this.walletRepository.credit(transfer.toWallet, transfer.value, transaction)
      await this.createTransfer(transfer, ITransferStatus.COMPLETED)

      await transaction.query('COMMIT')
    } catch (error) {
      await transaction.query('ROLLBACK')
      const databaseError = error as DatabaseError

      if (databaseError.detail) {
        await this.createTransfer(transfer, ITransferStatus.FAILED)
        throw new RepositoryError(databaseError.detail)
      }

      const apiError = error as ApiError
      if (apiError.statusCode) {
        await this.createTransfer(transfer, ITransferStatus.DENIED)
        throw apiError
      }

      await this.createTransfer(transfer, ITransferStatus.FAILED)
      throw new ApiError('Unknown error on repository', 500, error as object)
    } finally {
      transaction.release()
    }
  }

  private async createTransfer(transfer: ITransfer, status: ITransferStatus): Promise<ITransfer> {
    const query = `
      INSERT INTO transfers (status, value, from_wallet, to_wallet)
      VALUES ('${status}', $3, $1, $2)
      RETURNING id, status, value, from_wallet as fromWallet, to_wallet as toWallet, created_at as createdAt;
    `
    const values = [transfer.fromWallet, transfer.toWallet, transfer.value]

    try {
      const result = await this.database.executeQuery(query, values)
      return result.rows[0]
    } catch (error) {
      const databaseError = error as DatabaseError
      console.log(databaseError)
      if (databaseError.detail) {
        throw new RepositoryError(databaseError.detail)
      }
      throw new ApiError('Unknown error on repository', 500, error as object)
    }
  }

  async createFailedTransfer(
    transfer: ITransfer,
    status: ITransferStatus.DENIED | ITransferStatus.FAILED,
  ): Promise<ITransfer> {
    return await this.createTransfer(transfer, status)
  }

  async find(id: string): Promise<ITransfer> {
    const query = `
    SELECT id, status, value, from_wallet as fromWallet, to_wallet as toWallet, created_at as createdAt
    FROM transfers
    WHERE id = $1
    `
    const values = [id]

    const result = await this.database.executeQuery(query, values)
    if (result.rowCount === 0) {
      throw new EntityNotFound('Customer', id)
    }
    return result.rows[0] as ITransfer
  }
}
