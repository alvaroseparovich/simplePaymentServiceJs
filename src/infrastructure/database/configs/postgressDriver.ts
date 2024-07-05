import { Pool, type PoolClient } from 'pg'

export class Database {
  pool
  constructor(
    user = process.env.DATABASE_USER,
    host = process.env.DATABASE_HOST,
    database = process.env.DATABASE_NAME,
    password = process.env.DATABASE_PASSWORD,
    port = Number(process.env.DATABASE_PORT) || 5432,
  ) {
    this.pool = new Pool({
      user,
      host,
      database,
      password,
      port,
      max: 10,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 2000,
    })
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async executeQuery(query: string, params: Array<any>, pool: PoolClient | Pool = this.pool) {
    return await pool.query(query, params)
  }

  async getTransactionPool() {
    return await this.pool.connect()
  }
}

export const database = new Database()
