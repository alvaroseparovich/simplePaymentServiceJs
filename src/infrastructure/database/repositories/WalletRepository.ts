import type { Pool } from 'pg'
import type { IWallet } from '#domain/interfaces/IEntities'
import type { IWalletRepository } from '#domain/interfaces/IRepositories'
import { database } from '#infrastructure/database/configs/postgressDriver'
import type { Database } from '#infrastructure/database/configs/postgressDriver'

export class WalletRepository implements IWalletRepository {
  private database: Database

  constructor() {
    this.database = database
  }

  async create(wallet: IWallet, customer_id: string): Promise<IWallet> {
    const query = `
    INSERT INTO wallets (customer_id, wallet_type, balance)
    VALUES ($1, $2, $3)
    RETURNING id, customer_id, wallet_type as type, balance
    `

    const values = [customer_id, wallet.type, wallet.balance]

    const result = await this.database.executeQuery(query, values)
    return result.rows[0]
  }

  async find(customer_id: string): Promise<IWallet> {
    const query = `
    SELECT id, customer_id, wallet_type as type, balance
    FROM wallets
    WHERE customer_id = $1
    `
    const values = [customer_id]

    const result = await this.database.executeQuery(query, values)
    return result.rows[0] as IWallet
  }
}
