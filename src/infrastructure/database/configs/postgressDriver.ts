import { Pool } from 'pg'

export class Database {
  pool
  constructor() {
    this.pool = new Pool({
      user: process.env.DATABASE_USER,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      port: Number(process.env.DATABASE_PORT) || 5432,
    })
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async executeQuery(query: string, params: Array<any>) {
    const client = await this.pool.connect()

    // Example:
    // const query = `
    //   INSERT INTO customers (full_name, email, document)
    //   VALUES ($1, $2, $3)
    // `;
    // const params = [
    //   customer.name,
    //   customer.email,
    //   customer.document
    // ];

    const res = await client.query(query, params)
    client.release()
    return res
  }
}

export const database = new Database()
