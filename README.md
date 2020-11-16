## Replay Safe contract deployment

### Running on ganache

- Copy sample env `cp .env.sample .env`
- Start testing ganache with `yarn testnet`
- Run `yarn deploy`

### Running on custom network

- Copy sample env `cp .env.sample .env`
- Adjust `.env` file for your setup
  - MNEMONIC will be used to create the account that funds the Safe deployment account
  - RPC_URL will be used to interact with the EVM based chain
- Run `yarn deploy`

### Transactions

#### Safe 1.1.1 and Factory

Three transactions are required:
- Safe mastercopy deployment
- Registry setup (only useful on mainnet, but needs to be executed to have correct nonce for factory)
- Proxy factory deployment

All three transactions have been executed originally at a gas price of 10 GWei, therefore the same gas price has to be used when replaying them.

#### Safe 1.2.0

Note: These contracts use the factory from version 1.1.1

One transaction is required:
- Safe mastercopy deployment

The transaction has been executed originally at a gas price of 60 GWei, therefore the same gas price has to be used when replaying it.