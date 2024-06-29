import type { ITransferDTO } from '#domain/interfaces/IApiController'
import type { IAuthorizerExternalService } from '#domain/interfaces/IServices'

export class AuthorizerExternal implements IAuthorizerExternalService {
  async authorizeTransaction(transferDto: ITransferDTO): Promise<void> {}
}
