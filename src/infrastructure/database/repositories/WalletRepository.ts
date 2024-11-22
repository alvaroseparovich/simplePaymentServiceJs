import type { Pool, PoolClient } from 'pg'
import type { IWallet } from '#domain/interfaces/IEntities'
import { database } from '#infrastructure/database/configs/postgressDriver'
import type { Database } from '#infrastructure/database/configs/postgressDriver'

export class WalletRepository {
  private database: Database

  constructor() {
    this.database = database
  }

  async create(wallet: IWallet, customerId: string): Promise<IWallet> {
    const query = `
    INSERT INTO wallets (customer_id, wallet_type, balance)
    VALUES ($1, $2, $3)
    RETURNING id, customer_id, wallet_type as type, balance
    `

    const values = [customerId, wallet.type, wallet.balance]

    const result = await this.database.executeQuery(query, values)
    return result.rows[0]
  }

  async find(customerId: string): Promise<IWallet> {
    const query = `
    SELECT id, customer_id, wallet_type as type, balance
    FROM wallets
    WHERE customer_id = $1
    `
    const values = [customerId]

    const result = await this.database.executeQuery(query, values)
    return result.rows[0] as IWallet
  }

  async debit(customerId: string, value: number, pool: PoolClient | Pool = this.database.pool): Promise<void> {
    console.log('customerId =', customerId, ', value = ', value)
    const query = `
    UPDATE wallets
    SET balance = balance - $1
    WHERE customer_id = $2
    `

    const values = [value, customerId]

    await this.database.executeQuery(query, values, pool)
  }

  async credit(customerId: string, value: number, pool: PoolClient | Pool = this.database.pool): Promise<void> {
    const query = `
    UPDATE wallets
    SET balance = balance + $1
    WHERE customer_id = $2
    `

    const values = [value, customerId]

    await this.database.executeQuery(query, values, pool)
  }

  async getAndLockBalance(customerId: string, pool: PoolClient | Pool): Promise<number> {
    const query = `
    SELECT balance FROM wallets WHERE id = $1 FOR UPDATE
    `

    const values = [customerId]

    return (await this.database.executeQuery(query, values, pool)).rows[0].balance
  }
}
