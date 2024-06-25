import type { Pool } from 'pg'
import type { ICustomer } from '#domain/interfaces/IEntities'
import type { ICustomerRepository } from '#domain/interfaces/IRepositories'
import { database } from '#infrastructure/database/configs/postgressDriver'
import type { Database } from '#infrastructure/database/configs/postgressDriver'

export class CustomerRepository implements ICustomerRepository {
  private pool: Pool
  private database: Database

  constructor() {
    this.pool = database.pool
    this.database = database
  }

  async create(customer: ICustomer): Promise<ICustomer> {
    const query = `
    INSERT INTO customers (full_name, email, document)
    VALUES ($1, $2, $3)
    RETURNING id, full_name as name, email, document
    `

    const values = [customer.name, customer.email, customer.document]

    const result = await this.database.executeQuery(query, values)
    return result.rows[0]
  }

  find(id: ICustomer['id']): ICustomer {
    return { id } as ICustomer
  }

  // async read(id: number): Promise<Customer | null> {
  //   const query = 'SELECT * FROM customers WHERE id = $1';
  //   const res = await this.pool.query(query, [id]);

  //   if (res.rows.length > 0) {
  //     return res.rows[0];
  //   } else {
  //     return null;
  //   }
  // }

  // async readAll(): Promise<Customer[]> {
  //   const query = 'SELECT * FROM customers';
  //   const res = await this.pool.query(query);
  //   return res.rows;
  // }

  // async update(id: number, customer: Partial<Customer>): Promise<Customer | null> {
  //   const fields = [];
  //   const values = [];
  //   let index = 1;

  //   if (customer.name) {
  //     fields.push(`name = $${index++}`);
  //     values.push(customer.name);
  //   }
  //   if (customer.email) {
  //     fields.push(`email = $${index++}`);
  //     values.push(customer.email);
  //   }
  //   if (customer.phone) {
  //     fields.push(`phone = $${index++}`);
  //     values.push(customer.phone);
  //   }

  //   if (fields.length === 0) {
  //     return null;
  //   }

  //   values.push(id);

  //   const query = `
  //     UPDATE customers
  //     SET ${fields.join(', ')}
  //     WHERE id = $${index}
  //     RETURNING *;
  //   `;

  //   const res = await this.pool.query(query, values);
  //   if (res.rows.length > 0) {
  //     return res.rows[0];
  //   } else {
  //     return null;
  //   }
  // }

  // async delete(id: number): Promise<boolean> {
  //   const query = 'DELETE FROM customers WHERE id = $1';
  //   const res = await this.pool.query(query, [id]);
  //   return res.rowCount > 0;
  // }
}
