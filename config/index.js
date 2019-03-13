require('dotenv').config()

const NETWORK_ID = {
  TOMOCHAIN: '88',
  TOMOCHAIN_TESTNET: '89',
  DEVELOPMENT: '8888',
}

const rewardAddresses = {
  '1': '',
  '8888': '0xD3050147F1AC4c552941930C7b27386dE8A710b8',
}

let tokenContracts = null
const getTokenContracts = (artifacts, filters) => {
  if (tokenContracts === null) {
    tokenContracts = [
      artifacts.require('../contracts/tokens/BTC.sol'),
      artifacts.require('../contracts/tokens/ETH.sol'),
      artifacts.require('../contracts/tokens/USDT.sol'),
    ]
  }
  if (!filters) return tokenContracts
  return tokenContracts.filter(tokenContract =>
    filters.includes(tokenContract.contractName),
  )
}

module.exports = {
  NETWORK_ID,
  tokens: [
    'BTC',
    'ETH',
    'USDT',
  ],
  rewardAddresses,
  // truffle config
  rpcEndpoints: {
    tomochain: 'https://rpc.tomochain.com',
    tomochainTestnet: 'https://testnet.tomochain.com',
  },
  constants: {
    development: {
      DEFAULT_GAS: 4.5 * 10 ** 6,
      MAX_GAS: 6.0 * 10 ** 6,
      DEFAULT_LOW_GAS_PRICE: 0.1 * 10 ** 9,
      DEFAULT_GAS_PRICE: 15 * 10 ** 9,
      DEFAULT_HIGH_GAS_PRICE: 9 * 10 ** 9,
    },
    tomochain: {
      DEFAULT_GAS: 4.5 * 10 ** 6,
      MAX_GAS: 20 * 10 ** 6,
      DEFAULT_LOW_GAS_PRICE: 0.1 * 10 ** 9,
      DEFAULT_GAS_PRICE: 10 ** 14,
      DEFAULT_HIGH_GAS_PRICE: 9 * 10 ** 9,
    },
    tomochainTestnet: {
      DEFAULT_GAS: 4.5 * 10 ** 6,
      MAX_GAS: 20 * 10 ** 6,
      DEFAULT_LOW_GAS_PRICE: 0.1 * 10 ** 9,
      DEFAULT_GAS_PRICE: 10 ** 14,
      DEFAULT_HIGH_GAS_PRICE: 9 * 10 ** 9,
    },
  },
  accounts: {
    marketMaker: [
      '0x7d8d88fA6726c8853d3f382e4915f43f4D549d0e',
    ],
    development: [
      '0xF069080F7acB9a6705b4a51F84d9aDc67b921bDF',
      '0x657B4CbA193CCac878a3561F36329Facd6D19825',
    ],
  },
  getTokenContracts,
}
