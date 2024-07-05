import type { ITransferWalletsDTO } from '#domain/interfaces/IApiController'
import type { ITransfer } from '#domain/interfaces/IEntities'
import { ITransferStatus } from '#domain/interfaces/IEntities'
import type { ITransferWithCustomerDTO } from '#domain/services/TransferService'

export class Transfer implements ITransfer {
  id?: string
  status: ITransferStatus
  value: number
  fromWallet: string
  toWallet: string
  createdAt: Date
  constructor(transferDto: ITransferWithCustomerDTO, status: ITransferStatus = ITransferStatus.FAILED) {
    this.status = status
    this.value = transferDto.value
    this.fromWallet = transferDto.payer.wallet?.id as string
    this.toWallet = transferDto.payee.wallet?.id as string
    this.createdAt = new Date()
  }
}
