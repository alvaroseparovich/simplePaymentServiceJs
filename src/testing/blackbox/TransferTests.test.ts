import assert from 'node:assert'
import { describe, test } from 'node:test'
import type { ITransferDTO } from '#domain/interfaces/IApiController'
import { IWalletTypes } from '#domain/interfaces/IEntities'
import { Ftch } from '#testing/blackbox/helper/Ftch'

describe('BlackBox TEST', () => {
  const ftch = new Ftch('http://localhost:8081')

  describe('Transfer BlackBox TEST', async () => {
    const customerPayer = {
      name: 'Amanda Payer',
      document: '12345678922',
      email: 'customer@payer.com',
      password: 'valueHere',
      wallet: {
        type: IWalletTypes.CUSTOMER,
      },
    }
    const customerPayee = {
      name: 'Claudia Payee',
      document: '12345678933',
      email: 'customer@payee.com',
      password: 'valueHere',
      wallet: {
        type: IWalletTypes.CUSTOMER,
      },
    }

    test('Transfer - Life cicle', async () => {
      // create a Customer
      {
        const responsePayer = await ftch.post('customer', customerPayer)
        assert.equal(responsePayer.statuscode, 201, 'should Create Payer')
        const responsePayee = await ftch.post('customer', customerPayee)
        assert.equal(responsePayee.statuscode, 201, 'should Create Payee')

        const payer = JSON.parse(responsePayer.body)
        const payee = JSON.parse(responsePayee.body)

        const transferDTO: ITransferDTO = {
          value: 200,
          payer: String(payer.id),
          payee: String(payee.id),
        }
        const responseTransfer = await ftch.post('transfer', transferDTO)
        console.log(responseTransfer)
      }
    })
  })
})
