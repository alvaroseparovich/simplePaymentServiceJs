import assert from 'node:assert'
import { describe, test } from 'node:test'
import { IWalletTypes } from '#domain/interfaces/IEntities'
import { Ftch } from '#testing/etoe/Ftch'

describe('E2E TEST', () => {
  const ftch = new Ftch('http://localhost:8081')

  describe('Customer E2E TEST', async () => {
    const customerDefault = {
      name: 'Kanopka Martin',
      document: '12345678911',
      email: 'asd@asd.com',
      password: 'valueHere',
      wallet: {
        type: IWalletTypes.CUSTOMER,
      },
    }

    test('Customer - Life cicle', async () => {
      let customerId: number | string
      // No Customer Found
      {
        const response = await ftch.get('customer/1')
        assert.equal(response.statuscode, 404, 'No customer, should be null')
      }
      // create a Customer
      {
        const response = await ftch.post('customer', customerDefault)
        assert.equal(response.statuscode, 201, 'On sucess, status code hould be 201')
        const parsedResponse = JSON.parse(response.body)
        assert.notEqual(parsedResponse.id, undefined, 'Should return a id')
        customerId = parsedResponse.id
        assert.equal(parsedResponse.name, customerDefault.name, 'On Success should return the payload saved')
        assert.equal(parsedResponse.document, customerDefault.document, 'On Success should return the payload saved')
        assert.equal(parsedResponse.email, customerDefault.email, 'On Success should return the payload saved')
        assert.equal(parsedResponse.password, undefined, 'On Success should not return password')
        assert.equal(
          parsedResponse.wallet.type,
          customerDefault.wallet.type,
          'On Success should return the payload saved',
        )

        assert.equal(parsedResponse.wallet.balance, 300, 'All clients starts with R$ 300')
      }
      // Customer Found
      {
        const response = await ftch.get(`customer/${customerId}`)
        assert.equal(response.statuscode, 200, 'should find last customecreated')
        const parsedResponse = JSON.parse(response.body)
        assert.notEqual(parsedResponse.id, undefined, 'Should return a id')
        customerId = parsedResponse.id
        assert.equal(parsedResponse.name, customerDefault.name, 'Should return the customer')
        assert.equal(parsedResponse.document, customerDefault.document, 'Should return the customer')
        assert.equal(parsedResponse.email, customerDefault.email, 'Should return the customer')
        assert.equal(parsedResponse.password, undefined, 'Should not return pass')
        assert.equal(parsedResponse.wallet.type, customerDefault.wallet.type, 'Should return the customer')

        assert.equal(parsedResponse.wallet.balance, 300, 'All clients starts with R$ 300')
      }
    })
  })
})
