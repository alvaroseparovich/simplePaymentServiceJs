import { autoInjectable, delay, inject } from 'tsyringe'
import type { ICustomer, IWallet } from '#domain/interfaces/IEntities'
import { CustomerRepository } from '#infrastructure/database/repositories/CustomerRepository'
import { WalletService } from './WalletService'

@autoInjectable()
export class CustomerService {
  customerRepository: CustomerRepository
  walletService: WalletService

  constructor(
    @inject(delay(() => CustomerRepository))
    customerRepository: CustomerRepository,
    @inject(delay(() => WalletService))
    walletService: WalletService,
  ) {
    this.customerRepository = customerRepository
    this.walletService = walletService
  }

  async saveCustomer(customer: ICustomer): Promise<ICustomer> {
    const customerSaved = await this.customerRepository.create(customer)

    const wallet = {
      type: customer.wallet?.type,
      balance: 300,
    }
    const walletSaved = await this.walletService.saveWallet(wallet as IWallet, customerSaved.id as string)
    customerSaved.wallet = {
      type: walletSaved.type,
      balance: walletSaved.balance,
    }
    return customerSaved as ICustomer
  }

  async getCustomer(id: string): Promise<ICustomer> {
    const customer = await this.customerRepository.find(id)
    const wallet = await this.walletService.getWallet(customer.id as string)

    customer.wallet = wallet
    return customer
  }
}
