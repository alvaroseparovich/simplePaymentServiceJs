import assert from 'node:assert'
import { describe, test } from 'node:test'
import { IWalletTypes } from '#domain/interfaces/IEntities'
import { Ftch } from '#testing/blackbox/helper/Ftch'

describe('BlackBox TEST', () => {
  const ftch = new Ftch('http://localhost:8081')
  let counter = 0
  function assertN() {
    counter++
    return counter
  }

  describe('Customer BlackBox TEST', async () => {
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
        assert.equal(response.statuscode, 404, `#${assertN()} No customer, should be null`)
      }
      // create a Customer
      {
        const response = await ftch.post('customer', customerDefault)
        assert.equal(response.statuscode, 201, `#${assertN()} On sucess, status code hould be 201`)
        const parsedResponse = JSON.parse(response.body)
        assert.notEqual(parsedResponse.id, undefined, `#${assertN()} Should return a id`)
        customerId = parsedResponse.id
        assert.equal(
          parsedResponse.name,
          customerDefault.name,
          `#${assertN()} On Success should return the payload saved`,
        )
        assert.equal(
          parsedResponse.document,
          customerDefault.document,
          `#${assertN()} On Success should return the payload saved`,
        )
        assert.equal(
          parsedResponse.email,
          customerDefault.email,
          `#${assertN()} On Success should return the payload saved`,
        )
        assert.equal(parsedResponse.password, undefined, `#${assertN()} On Success should not return password`)
        assert.equal(
          parsedResponse.wallet.type,
          customerDefault.wallet.type,
          `#${assertN()} On Success should return the payload saved`,
        )

        assert.equal(parsedResponse.wallet.balance, 300, `$${assertN()} All clients starts with R$ 300`)
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
