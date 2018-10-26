
# Proof DEX
Official Repository for the Proof Decentralized Exchange

<!-- [![Build Status](https://travis-ci.org/ProofSuite/ProofCryptoFiat.svg?branch=develop)](https://travis-ci.org/ProofSuite/ProofCryptoFiat) -->
<!-- [![Code Coverage](https://codecov.io/gh/ProofSuite/ProofCryptoFiat/branch/develop/graph/badge.svg)](https://codecov.io/gh/ProofSuite/ProofCryptoFiat) -->

[![GitHub Issues](https://img.shields.io/github/issues/Proofsuite/amp-dex.svg)](https://github.com/Proofsuite/amp-dex/issues)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)

## Architecture

The proof decentralized exchange is a hybrid decentralized exchange that aims at bringing together the ease of use of centralized exchanges along with the
security and privacy features of decentralized exchanges. Orders are matched through the proof orderbook. After orders are matched, the decentralized exchange
operator has the sole ability to perform a transaction to the smart contract. This provides for the best UX as the exchange operator is the only party having to
interact directly with the blockchain. Exchange users simply sign orders which are broadcasted to the orderbook. This enables users to cancel their orders without
having to perform a blockchain transaction and pay the associated gas fees.

## Smart Contract API

To execute a trade, `executeTrade` needs to be called with the following arguments:

| Argument            | Type                             | Description                     |
| ------------------- | -------------------------------- |-------------------------------- |
| amountBuy           | uint256                          | Amount of _tokenBuy_ tokens the maker wants to buy |
| amountSell          | uint256                          | Amount of _tokenSell_ tokens the maker wants to sell |
| expires             | uint256                          | Blocknumber at which the order will no longer be valuable |
| nonce               | uint256                          | Random number to ensure uniqueness of the order |
| feeMake             | uint256                          | Percentage of fee taken from maker token value |
| feeTake             | uint256                          | Percentage of fee taken from taker token value |
| amount              | uint256                          | Amount of _tokenBuy_ the taker wants to **sell** |
| tradeNonce          | uint256                          | Random number to ensure uniqueness of the trade |
| tokenBuy            | address                          | Address of _tokenBuy_ (token the maker wants to buy) |
| tokenSell           | address                          | Address of _tokenSell_ (token the maker wants to sell) |
| maker               | address                          | Maker Address |
| taker               | address                          | Taker Address |
| vMaker              | uint8                            | Maker Signature v Parameter |
| vTaker              | uint8                            | Taker Signature v Parameter |
| rMaker              | bytes32                          | Maker Signature r Parameter |
| rTaker              | bytes32                          | Maker Signature r Parameter |
| sMaker              | bytes32                          | Maker Signature s Parameter |
| sTaker              | bytes32                          | Maker Signature s Parameter |

Each group of values must be packed together in array based on their type (See Exchange.sol)


To do a _hard cancel_, `cancelOrder` needs to be called with the following arguments

| Argument            | Type                             | Description                     |
| ------------------- | -------------------------------- |-------------------------------- |
| amountBuy           | uint256                          | Amount of _tokenBuy_ tokens the maker wants to buy |
| amountSell          | uint256                          | Amount of _tokenSell_ tokens the maker wants to sell |
| expires             | uint256                          | Blocknumber at which the order will no longer be valuable |
| nonce               | uint256                          | Random number to ensure uniqueness of the order |
| feeMake             | uint256                          | Percentage of fee taken from maker token value |
| feeTake             | uint256                          | Percentage of fee taken from taker token value |
| tokenBuy            | address                          | Address of _tokenBuy_ (token the maker wants to buy) |
| tokenSell           | address                          | Address of _tokenSell_ (token the maker wants to sell) |
| maker               | address                          | Maker Address |
| v                   | uint8                            | Maker Signature v Parameter |
| r                   | bytes32                          | Maker Signature r Parameter |
| s                   | bytes32                          | Maker Signature s Parameter |

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
git clone https://github.com/ProofSuite/proof-dex.git
cd prood-dex
npm install
```

- Install the latest version of truffle (Truffle v4.0.6)


```
npm install -g truffle
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

Thank you for considering helping the Proof project !

To make the Proof project truely revolutionary, we need and accept contributions from anyone and are grateful even for the smallest fixes.

If you want to help Proof, please fork and setup the development environment of the appropriate repository.
In the case you want to submit substantial changes, please get in touch with our development team on our slack channel (slack.proofsuite.com) to
verify those modifications are in line with the general goal of the project and receive early feedback. Otherwise you are welcome to fix, commit and
send a pull request for the maintainers to review and merge into the main code base.

Please make sure your contributions adhere to our coding guidelines:

- Code must adhere as much as possible to standard conventions (DRY - Separation of concerns - Modular)
- Pull requests need to be based and opened against the master branch
- Commit messages should properly describe the code modified
- Ensure all tests are passing before submitting a pull request

## License

The Proof CryptoFiat smart contract (i.e. all code inside of the contracts and test directories) is licensed under the MIT License, also included in our repository in the
LICENSE file.




