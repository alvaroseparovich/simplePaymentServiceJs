import { Transfer } from '#domain/entity/Transfer'
import { TransferDeniedError } from '#domain/errors/Exceptions'
import type { ITransferDTO, ITransferResponseDTO } from '#domain/interfaces/IApiController'
import { type ICustomer, type ITransfer, ITransferStatus, IWalletTypes } from '#domain/interfaces/IEntities'
import type { ITransferRepository } from '#domain/interfaces/IRepositories'
import type {
  IAuthorizerExternalService,
  ICustomerService,
  ITransferService,
  IWalletService,
} from '#domain/interfaces/IServices'

export class TransferService implements ITransferService {
  private transferRepository: ITransferRepository
  private customerService: ICustomerService
  private authorizer: IAuthorizerExternalService

  constructor(
    transferRepository: ITransferRepository,
    customerService: ICustomerService,
    authorizer: IAuthorizerExternalService,
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
