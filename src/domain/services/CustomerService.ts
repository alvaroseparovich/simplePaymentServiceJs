import type { ICustomer, IWallet } from '#domain/interfaces/IEntities'
import type { ICustomerRepository } from '#domain/interfaces/IRepositories'
import type { ICustomerService, IWalletService } from '#domain/interfaces/IServices'

export class CustomerService implements ICustomerService {
  customerRepository: ICustomerRepository
  walletService: IWalletService
  constructor(customerRepository: ICustomerRepository, walletService: IWalletService) {
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

    customer.wallet = {
      type: wallet.type,
      balance: wallet.balance,
    }
    return customer
  }
}
