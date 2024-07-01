import { Transfer } from '#domain/entity/Transfer'
import type { ITransferDTO, ITransferResponseDTO } from '#domain/interfaces/IApiController'
import { type ICustomer, ITransferStatus, type IWallet } from '#domain/interfaces/IEntities'
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
  private walletService: IWalletService
  private authorizer: IAuthorizerExternalService

  constructor(
    transferRepository: ITransferRepository,
    customerService: ICustomerService,
    walletService: IWalletService,
    authorizer: IAuthorizerExternalService,
  ) {
    this.transferRepository = transferRepository
    this.customerService = customerService
    this.walletService = walletService
    this.authorizer = authorizer
  }

  async transfer(transferDto: ITransferDTO): Promise<ITransferResponseDTO> {
    await this.authorizer.authorizeTransaction(transferDto)

    // START TRANSACTION
    const payee = await this.customerService.getCustomer(transferDto.payee)
    const payer = await this.customerService.getCustomer(transferDto.payer)

    await this.validateTransfer({ value: transferDto.value, payee, payer })

    const transfer = new Transfer(transferDto)

    await this.walletService.debit(payer.id as string, transferDto.value)
    await this.walletService.credit(payee.id as string, transferDto.value)

    transfer.status = ITransferStatus.COMPLETED
    await this.transferRepository.create(transfer)
    // COMMIT TRANSACTION

    // TODO EVENT EMMIT
    return {
      ...transferDto,
      success: true,
      createdAt: transfer.createdAt,
    }
  }

  private async validateTransfer(transfer: ITransferWithCustomerDTO): Promise<void> {}
}

export interface ITransferWithCustomerDTO {
  value: number
  payer: ICustomer
  payee: ICustomer
}
