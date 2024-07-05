import type { IWallet } from '#domain/interfaces/IEntities'
import type { IWalletRepository } from '#domain/interfaces/IRepositories'
import type { IWalletService } from '#domain/interfaces/IServices'

export class WalletService implements IWalletService {
  walletRepository: IWalletRepository
  constructor(walletRepository: IWalletRepository) {
    this.walletRepository = walletRepository
  }
  async saveWallet(wallet: IWallet, customerId: string): Promise<IWallet> {
    return this.walletRepository.create(wallet, customerId)
  }
  async getWallet(customerId: string): Promise<IWallet> {
    return this.walletRepository.find(customerId)
  }
}
