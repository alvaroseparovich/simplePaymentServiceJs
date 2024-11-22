import { autoInjectable, delay, inject } from 'tsyringe'
import type { IWallet } from '#domain/interfaces/IEntities'
import { WalletRepository } from '#infrastructure/database/repositories/WalletRepository'

@autoInjectable()
export class WalletService {
  walletRepository: WalletRepository
  constructor(
    @inject(delay(() => WalletRepository))
    walletRepository: WalletRepository,
  ) {
    this.walletRepository = walletRepository
  }
  async saveWallet(wallet: IWallet, customerId: string): Promise<IWallet> {
    return this.walletRepository.create(wallet, customerId)
  }
  async getWallet(customerId: string): Promise<IWallet> {
    return this.walletRepository.find(customerId)
  }
}
