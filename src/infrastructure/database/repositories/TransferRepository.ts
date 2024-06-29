import type { DatabaseError } from 'pg'
import { ApiError, EntityNotFound, RepositoryError } from '#domain/errors/Exceptions'
import type { ITransfer } from '#domain/interfaces/IEntities'
import type { ITransferRepository } from '#domain/interfaces/IRepositories'
import { database } from '#infrastructure/database/configs/postgressDriver'
import type { Database } from '#infrastructure/database/configs/postgressDriver'

export class TransferRepository implements ITransferRepository {
  private database: Database

  constructor(db = database) {
    this.database = db
  }

  async create(transfer: ITransfer): Promise<ITransfer> {
    const query = `
    INSERT INTO transfer (status, value, fromWallet, toWallet, createdAt)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, status, value, fromWallet, toWallet, createdAt
    `
    const values = [transfer.status, transfer.value, transfer.fromWallet, transfer.toWallet, transfer.createdAt]

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

  async find(id: string): Promise<ITransfer> {
    const query = `
    SELECT id, status, value, fromWallet, toWallet, createdAt
    FROM transfer
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
