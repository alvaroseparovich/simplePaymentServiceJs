import assert from 'node:assert'
import { describe, test } from 'node:test'
import type { ITransferDTO } from '#domain/interfaces/IApiController'
import { type ICustomer, IWalletTypes } from '#domain/interfaces/IEntities'
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
        assert.equal(responseTransfer.statuscode, 200, 'Transefer succeed')
        assert.equal(JSON.parse(responseTransfer.body).success, true, 'Transefer body success')

        const getPayer = JSON.parse((await ftch.get(`customer/${String(payer.id)}`)).body) as ICustomer
        assert.equal(getPayer.wallet?.balance, 100, `need to have the original balance minus ${transferDTO.value}`)
        const getPayee = JSON.parse((await ftch.get(`customer/${String(payee.id)}`)).body) as ICustomer
        assert.equal(getPayee.wallet?.balance, 500, `need to have the original balance plus ${transferDTO.value}`)
      }
    })
  })
})
