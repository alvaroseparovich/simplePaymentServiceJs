import type { IWallet } from '#domain/interfaces/IEntities'
import type { IWalletRepository } from '#domain/interfaces/IRepositories'
import type { IWalletService } from '#domain/interfaces/IServices'

export class WalletService implements IWalletService {
  walletRepository: IWalletRepository
  constructor(walletRepository: IWalletRepository) {
    this.walletRepository = walletRepository
  }
  async saveWallet(wallet: IWallet, customer_id: string): Promise<IWallet> {
    return this.walletRepository.create(wallet, customer_id)
  }
  async getWallet(customer_id: string): Promise<IWallet> {
    return this.walletRepository.find(customer_id)
  }
  async debit(walletId: string, value: number): Promise<void> {
    console.log('debit called')
  }
  async credit(walletId: string, value: number): Promise<void> {
    console.log('credit called')
  }
}
