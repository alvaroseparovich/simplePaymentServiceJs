import type { ITransferDTO } from '#domain/interfaces/IApiController'
import type { ITransfer } from '#domain/interfaces/IEntities'
import { ITransferStatus } from '#domain/interfaces/IEntities'

export class Transfer implements ITransfer {
  id?: string
  status: ITransferStatus
  value: number
  fromWallet: string
  toWallet: string
  createdAt: Date
  constructor(transferDto: ITransferDTO) {
    this.status = ITransferStatus.FAILED
    this.value = transferDto.value
    this.fromWallet = transferDto.payer
    this.toWallet = transferDto.payee
    this.createdAt = new Date()
  }
}
