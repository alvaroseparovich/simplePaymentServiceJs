import { z } from 'zod'
import { IWalletTypes } from '#domain/interfaces/IEntities'

export const customerRequestDTOValidation = z.object({
  name: z.string().max(128),
  document: z.string().max(24).min(11),
  email: z.string().email(),
  password: z.string().max(64).min(6),
  wallet: z.object({
    type: z.nativeEnum(IWalletTypes),
  }),
})
export const customerIdValidation = z.coerce.number()

export const transferValidation = z.object({
  value: z.number().int().safe().positive(),
  payer: z.number(),
  payee: z.number(),
})
