import type { IWallet } from '#domain/interfaces/IEntities'
import type { IWalletRepository } from '#domain/interfaces/IRepositories'
import { database } from '#infrastructure/database/configs/postgressDriver'
import type { Database } from '#infrastructure/database/configs/postgressDriver'

export class WalletRepository implements IWalletRepository {
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

  async debit(customerId: string, value: number): Promise<void> {
    console.log('customerId =', customerId, ', value = ', value)
    const query = `
    UPDATE wallets
    SET balance = balance - $1
    WHERE customer_id = $2
    `

    const values = [value, customerId]

    await this.database.executeQuery(query, values)
  }

  async credit(customerId: string, value: number): Promise<void> {
    const query = `
    UPDATE wallets
    SET balance = balance + $1
    WHERE customer_id = $2
    `

    const values = [value, customerId]

    await this.database.executeQuery(query, values)
  }
}
