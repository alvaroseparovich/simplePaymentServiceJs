import assert from 'node:assert'
import { describe, test } from 'node:test'
import { ApiController } from '#domain/controllers/ApiController'
import { IWalletTypes } from '#domain/interfaces/IEntities'

describe('ApiController UNIT TEST', () => {
  const apiController = new ApiController()

  describe('ApiController/Customer UNIT TEST', () => {
    test('GET Customer - no customer', () => {
      const customer = apiController.getCustomer(1)
      assert.equal(customer, {}, 'No customer, should be null')
    })
    test('POST Customer', () => {
      const customer = apiController.postCustomer({
        name: 'Kanopka Martin',
        document: '12345678911',
        email: 'asd@asd.com',
        password: 'valueHere',
        wallet: {
          type: IWalletTypes.CUSTOMER,
        },
        NON_EXPECTED: 'Crazy',
      })
      assert.equal(customer, {}, 'No customer, should be null')
    })
  })
})
