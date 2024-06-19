# Main Documentation

## TLDR;
Here we are explaining the core functionalities and limit our scope.
We want to implement a project following the guidelines described here.

## Scope Limit
Here we want to create just this user use cases.    
No other use case should be implemented.
just 3 use cases.
- transfer money
- verify balance
- create account
   
![usecases](/readme/imgs/usecases.png)
   
Even existing space to improvements in the system, just these MUST HAVE will be implemented.
    
To create transfers from customer to another a positive balance is a must-have.
Due to the limit scope, all customers created will start with 300 of balance.

# Implementation details
The most complex element here is the transaction.   
Here are some guides to the coders.

## Transaction process - communication flow
the transaction should be resilient against failure and eventualities.   
Everything should be reversible, and we need to maintain registry.   
![comunication-diagram](/readme/imgs/transaction-process-comunication-diagram.png)
   
## Transaction states
For the requirements in this project, there is no need for state machine to control the transaction flow.
Still, here is an explanation of the states, so any future modification should consider this current states.

We chose `Status` to represent the transactions final states.   
There is no need for persistence for any other status than these three:
- DENIED
- FAILED
- COMPLETED

Any other event on the transaction flow is just ephemeral and at the end will be persisted as one of these status above.    
    
![state-machine](/readme/imgs/state-machine.png)
    
## Database entities
Here are the only three entities we have.   
![db-entities](/readme/imgs/db-entities-pathern-of-search.png)    
Some observations here are relevant:
- password was removed due to security issues.
  - however, considering this is an example project, the password will be abstracted from application.
  - the only service that can access this property is the auth service, so we protect this value.
  - but this value can be persisted in the same table or DB just for simplicity.
  - In a real scenario the total segregation of this information is essential.
- As we want to make 2 database implementations, and one of them have more limits, we will use CustomerId and WalletId as the same value.
  - This decision can limit features like `One customer can have many wallets`.
  - It can be overcome, but as we do not pretend to add any other feature, this is enough.
- Just the unification of customerId and walletId can improve performance in some operations.

### For NoSQL database
Here is an example of schema to give high scalability and keep a fast performance due to sharding capabilities.   
Using a HashTable database we can assure that every request to database will be on time due to the simple search pathern and no need of joins.

![nosql](/readme/imgs/db-entities-nosql-option.png)


## Code overview
Here is a code structure to follow.     
![code-structure](/readme/imgs/code-overview-classdiagram.png)     
we should follow this (or update it in other files) to create the system.


# Contracts

## Required

This is the contract we need to follow for a transaction.
### Request to transfer money
```json
POST /transfer
Content-Type: application/json

{
  "value": 100.0,
  "payer": 4,
  "payee": 15
}
```

## Not Required
There are two other routes that we can create do facilitate the testing process, nad would be essential in a production environment.

### Request to create a customer
```json
POST /customer
Content-Type: application/json

{
  "name": "my name is giovane giorgio",
  "document": 1234567890,
  "email": "myName@email.com",
  "password": "asdfg",
  "wallet": {
    "type": "CUSTOMER"
  }
}
```
#### response
```json
{
  "id": 1,
  "name": "my name is giovane giorgio",
  "document": 1234567890,
  "email": "myName@email.com",
  "wallet": {
    "type": "CUSTOMER",
    "balance": 300.0
  }
}
```

### Request to get the customer
```curl
GET /cusmoter/1
```
#### response
```json
{
  "id": 1,
  "name": "my name is giovane giorgio",
  "document": 1234567890,
  "email": "myName@email.com",
  "wallet": {
    "type": "CUSTOMER",
    "balance": 300.0
  }
}
```