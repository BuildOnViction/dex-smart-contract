## I. Prerequisites
0.1. Configure Golang development environment
```
https://golang.org/doc/install
```

0.2. Download go-ethereum source code
```
https://geth.ethereum.org/install/#build-it-from-source-code
```
----------------
## II. Blockchain

You can use Ganache for development or the testnet of your own

## III. dex-smart-contract
1. Clone it: 
```
git clone git@github.com:tomochain/dex-smart-contract.git
```
2. Install truffle:
```
yarn global add truffle
```
3. Run `yarn install`

4. Update .env file with your mnemonic words (You can check file `.env.sample` for more information)

5. Deploy smart contracts to blockchain:
```
yarn deploy-contracts
```
This command will deploy smart contract to your local blockchain (--network development)

OR

```
truffle migrate --network tomochainTestnet
```
This command will deploy smart contract to Tomochain Testnet

OR

```
truffle migrate --network tomochain
```
This command will deploy smart contract to Tomochain Mainnet (but don't use for now)

----------------
## IV. dex-server
1. Clone it:
```
git clone git@github.com:tomochain/dex-server.git
```
2.  Checkout `develop` branch
3. Install necessary golang packages:
```
yarn install-requirements
```
4. Run docker environment
```
yarn start-env
```
OR 
```
yarn reset-env
```
in case you want to reset MongoDB, Redis, RabbitMQ data
5. Generate seed and import seed data into mongo
```
yarn seeds
```
6. Start the server
```
yarn start
```

----------------
## V. dex-client
1. Clone it:
```
git clone git@github.com:tomochain/dex-client.git
```
2. Install dependencies
```
yarn
```
3. Install `sass`:
```
https://sass-lang.com/install
```
4. Copy token addresses into file `src/config/addresses.json`:
```
yarn query-tokens
```
5. Start the development server
```
yarn start
```
This command will also compile sass files

----------------
## DONE
