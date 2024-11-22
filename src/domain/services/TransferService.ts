import { autoInjectable, delay, inject } from 'tsyringe'
import { Transfer } from '#domain/entity/Transfer'
import { TransferDeniedError } from '#domain/errors/Exceptions'
import type { ITransferDTO, ITransferResponseDTO } from '#domain/interfaces/IApiController'
import { type ICustomer, ITransferStatus, IWalletTypes } from '#domain/interfaces/IEntities'
import { TransferRepository } from '#infrastructure/database/repositories/TransferRepository'
import { AuthorizerExternal } from '#outsource-services/AuthorizerExternal'
import { CustomerService } from './CustomerService'

@autoInjectable()
export class TransferService {
  private transferRepository: TransferRepository
  private customerService: CustomerService
  private authorizer: AuthorizerExternal

  constructor(
    @inject(delay(() => TransferRepository))
    transferRepository: TransferRepository,
    @inject(delay(() => CustomerService))
    customerService: CustomerService,
    @inject(delay(() => AuthorizerExternal))
    authorizer: AuthorizerExternal,
  ) {
    this.transferRepository = transferRepository
    this.customerService = customerService
    this.authorizer = authorizer
  }

  async transfer(transferDto: ITransferDTO): Promise<ITransferResponseDTO> {
    await this.authorizer.authorizeTransaction(transferDto)

    const payee = await this.customerService.getCustomer(transferDto.payee)
    const payer = await this.customerService.getCustomer(transferDto.payer)

    const transferAndCustomers: ITransferWithCustomerDTO = { value: transferDto.value, payee, payer }
    await this.validateTransfer(transferAndCustomers)

    const transfer = new Transfer(transferAndCustomers)

    await this.transferRepository.create(transfer)

    // TODO EVENT EMMIT
    return {
      ...transferDto,
      success: true,
      createdAt: transfer.createdAt,
    }
  }

  private async validateTransfer(transferWithCustomers: ITransferWithCustomerDTO): Promise<void> {
    const DENIED = transferWithCustomers.payer.wallet?.type === IWalletTypes.COMPANY

    // TODO: EXTERNAL VALIDATION
    if (DENIED) {
      const transfer = new Transfer(transferWithCustomers, ITransferStatus.DENIED)
      this.transferRepository.createFailedTransfer(transfer, ITransferStatus.DENIED)
      throw new TransferDeniedError('Transfer DENIED')
    }
  }
}

export interface ITransferWithCustomerDTO {
  value: number
  payer: ICustomer
  payee: ICustomer
}
