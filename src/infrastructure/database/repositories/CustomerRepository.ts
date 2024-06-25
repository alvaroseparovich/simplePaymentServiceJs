import type { DatabaseError } from 'pg'
import { ApiError, EntityNotFound, RepositoryError } from '#domain/errors/Exceptions'
import type { ICustomer } from '#domain/interfaces/IEntities'
import type { ICustomerRepository } from '#domain/interfaces/IRepositories'
import { database } from '#infrastructure/database/configs/postgressDriver'
import type { Database } from '#infrastructure/database/configs/postgressDriver'

export class CustomerRepository implements ICustomerRepository {
  private database: Database

  constructor() {
    this.database = database
  }

  async create(customer: ICustomer): Promise<ICustomer> {
    const query = `
    INSERT INTO customers (full_name, email, document)
    VALUES ($1, $2, $3)
    RETURNING id, full_name as name, email, document
    `

    const values = [customer.name, customer.email, customer.document]

    try {
      const result = await this.database.executeQuery(query, values)
      return result.rows[0]
    } catch (error) {
      const databaseError = error as DatabaseError
      if (databaseError.detail) {
        throw new RepositoryError(databaseError.detail)
      }

      throw new ApiError('Unknown error on repository', 500, error as object)
    }
  }

  async find(id: string): Promise<ICustomer> {
    const query = `
    SELECT id, full_name as name, email, document
    FROM customers
    WHERE id = $1
    `
    const values = [id]

    const result = await this.database.executeQuery(query, values)
    if (result.rowCount === 0) {
      throw new EntityNotFound('Customer', id)
    }
    return result.rows[0] as ICustomer
  }
}
