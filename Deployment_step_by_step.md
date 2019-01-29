## I. Prerequisites
0.1. Configure Golang development environment
```
https://golang.org/doc/install
```

0.2. Install go-ethereum from source code
```
https://geth.ethereum.org/install/#build-it-from-source-code
```
----------------
## II. dex-protocol
1. Clone it: 
```
git clone git@github.com:tomochain/dex-protocol.git
```
2. Install necessary golang packages:
```
yarn install-requirements
```
3. 
```
    cd OrderBook
    mkdir $GOPATH/src/github.com/tomochain
    ln -sF $PWD $GOPATH/src/github.com/tomochain/orderbook
```
4. Reset go-ethereum repository to a specific commit in order to work (temporary):
```
    cd $GOPATH/src/github.com/ethereum/go-ethereum
    git reset --hard 880de230b44e20282abdef0f1f9a3294ce68e5d8
```
5. By default, we use POA consensus for demo  
    Assume you are in `dex-protocol` folder:
``` 
    Run Node1: `yarn node1 -mining true`  
    Run Node2: `yarn node2 -mining true`  
    Run Backend: `yarn backend` (optional)
```
----------------
## III. dex-smart-contract
1. Clone it: 
```
git clone git@github.com:tomochain/dex-smart-contract.git
```
2. Install truffle:
```
yarn global add truffle
```
3. Run `yarn`
4. Deploy contracts to blockchain:
```
yarn deploy-contracts
```
5. Update contract addresses in file `config/contractAddresses.json`
```
node scripts/update_contract_addresses.js
```
7. Create .env file
```
cp .env.sample .env
```
8. Update .env file with your parameters (if needed)
```
For example, change TOMO__MAINNET_PRIVATE_KEY to your Ethereum client's private key
```

----------------
## IV. dex-client
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
## V. dex-server
1. Clone it:
```
git clone git@github.com:tomochain/dex-server.git
```
2.  Checkout `develop` branch
3. Install necessary golang packages:
```
yarn install-requirements
```
4. Go to `dex-server` directory, run this command:
```
ln -sF $PWD $GOPATH/src/github.com/tomochain/backend-matching-engine
```
5. Run docker environment
```
yarn start-env
```
OR 
```
yarn reset-env
```
in case you want to reset MongoDB, Redis, RabbitMQ data
6. Generate seed and import seed data into mongo
```
yarn seeds
```
7. Start the server
```
yarn start
```

----------------
# DONE

## Reset in case something went wrong
1. Manually delete 2 folders `.data_30100` and `.data_30101` inside folder `dex-protocol` (these 2 folders are hidden)
```
cd dex-protocol
rm -rf .data_*
```
2. Do everything from point II. dex-protocol except some commands such as:
```
git clone ...
```
```
ln -sF ...
```
```
git reset ...
```
```
yarn install-requirements
```
