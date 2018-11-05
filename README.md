
# DEX smart contract
The smart contract samples of some tokens for the Decentralized Exchange

# Init smart contracts
If you have already put smart contracts in genesis block, just change the code from `await BTM.deployed()` to `await BTM.at("address")` then run
`truffle migrate -f 3 --to 3 --network development`  
Otherwise just run `truffle deploy --network development`  

# Init seed-data for client  
There are 2 ways to init data, first using deploy result then get data from server, second way is run:  
`node utils/tokens.js`  then copy the output into `src/config/addresses.json` file  

## Architecture

The smart contract samples used to deploy in creation block. The tokens contracts for selling and buying, and the Exchange contract used to allows two users to interact with. There is no matching engine logic inside the exchange contract, it is supposed to have trade logic only.

## Smart Contract API

To execute a trade, `executeTrade` needs to be called with the following arguments:

| Argument   | Type    | Description                                               |
| ---------- | ------- | --------------------------------------------------------- |
| buyAmount  | uint256 | Amount of _buyToken_ tokens the maker wants to buy        |
| sellAmount | uint256 | Amount of _sellToken_ tokens the maker wants to sell      |
| expires    | uint256 | Blocknumber at which the order will no longer be valuable |
| nonce      | uint256 | Random number to ensure uniqueness of the order           |
| feeMake    | uint256 | Percentage of fee taken from maker token value            |
| feeTake    | uint256 | Percentage of fee taken from taker token value            |
| amount     | uint256 | Amount of _buyToken_ the taker wants to **sell**          |
| tradeNonce | uint256 | Random number to ensure uniqueness of the trade           |
| buyToken   | address | Address of _buyToken_ (token the maker wants to buy)      |
| sellToken  | address | Address of _sellToken_ (token the maker wants to sell)    |
| maker      | address | Maker Address                                             |
| taker      | address | Taker Address                                             |
| vMaker     | uint8   | Maker Signature v Parameter                               |
| vTaker     | uint8   | Taker Signature v Parameter                               |
| rMaker     | bytes32 | Maker Signature r Parameter                               |
| rTaker     | bytes32 | Maker Signature r Parameter                               |
| sMaker     | bytes32 | Maker Signature s Parameter                               |
| sTaker     | bytes32 | Maker Signature s Parameter                               |

Each group of values must be packed together in array based on their type (See Exchange.sol)


To do a _hard cancel_, `cancelOrder` needs to be called with the following arguments

| Argument   | Type    | Description                                               |
| ---------- | ------- | --------------------------------------------------------- |
| buyAmount  | uint256 | Amount of _buyToken_ tokens the maker wants to buy        |
| sellAmount | uint256 | Amount of _sellToken_ tokens the maker wants to sell      |
| expires    | uint256 | Blocknumber at which the order will no longer be valuable |
| nonce      | uint256 | Random number to ensure uniqueness of the order           |
| feeMake    | uint256 | Percentage of fee taken from maker token value            |
| feeTake    | uint256 | Percentage of fee taken from taker token value            |
| buyToken   | address | Address of _buyToken_ (token the maker wants to buy)      |
| sellToken  | address | Address of _sellToken_ (token the maker wants to sell)    |
| maker      | address | Maker Address                                             |
| v          | uint8   | Maker Signature v Parameter                               |
| r          | bytes32 | Maker Signature r Parameter                               |
| s          | bytes32 | Maker Signature s Parameter                               |

Each group of values must be packed together in array based on their type (See Exchange.sol)

## Development and Testing Environment Setup

### Requirements :
- OSX or Linux (Windows setup is likely possible but not covered in this guide)
- Node (version 8.9.4 recommended)
- Solidity Compiler (v0.4.24)
- Ganache-cli (v6.1.3)
- Truffle (v4.1.12)
- npm (version 6.1.0)


### Testing Environment Setup :

- Clone the repository and install dependencies

```
git clone git@github.com:tomochain/dex-smart-contract.git
cd dex-smart-contract
yarn
```

- Install the latest version of truffle (Truffle v4.0.6)


```
yarn global add truffle
```

- Compile contracts
```
truffle compile
```

- Initialize testrpc (or geth)

```
./start_rpc.sh
```

- Migrate contracts to chosen network

```
truffle migrate --network development
```

- Make sure you are using the latest version of node

```
nvm install 8.9.4
nvm use 8.9.4
```


- Fill in `truffle.js` and `deploy_contracts.js` with appropriate wallet addresses. Unlock the corresponding addresses.

- Verify all tests are passing.

You need to re-migrate all contracts before running the test suite

```
truffle migrate --reset && truffle test
```

- You can interact with the contracts via the console

```
truffle console
```


- You can watch for changes on the fileystem with:

```
npm run watch
```

- Lint

```
npm run lint
```

## Contribution

This is a fork of the Proof project !

## License

The smart contract (i.e. all code inside of the contracts and test directories) is licensed under the MIT License, also included in our repository in the
LICENSE file.




