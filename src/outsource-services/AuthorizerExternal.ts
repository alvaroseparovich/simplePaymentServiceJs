import type { ITransferDTO } from '#domain/interfaces/IApiController'

export class AuthorizerExternal {
  async authorizeTransaction(transferDto: ITransferDTO): Promise<void> {}
}
