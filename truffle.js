// Allows us to use ES6 in our migrations and tests.
require('babel-register')

// Allows us to use ES6 in our migrations and tests.
require('dotenv').config()
const config = require('./config')
const secret = require('./config/secret')

require('babel-register')
require('babel-polyfill')

const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: config.NETWORK_ID.DEVELOPMENT,
      gas: config.constants.development.MAX_GAS,
      gasPrice: config.constants.development.DEFAULT_GAS_PRICE,
      from: '0xF9D87abd60435b70415CcC1FAAcA4F8B91786eDb', // testprc main account here
    },
    tomochain: {
      provider: () => new HDWalletProvider(secret.tomochain.mnemonic, config.rpcEndpoints.tomochain),
      network_id: config.NETWORK_ID.TOMOCHAIN,
      gas: config.constants.tomochain.MAX_GAS,
      gasPrice: config.constants.tomochain.DEFAULT_GAS_PRICE,
    },
    tomochainTestnet: {
      provider: () => new HDWalletProvider(secret.tomochainTestnet.mnemonic, config.rpcEndpoints.tomochainTestnet),
      network_id: config.NETWORK_ID.TOMOCHAIN_TESTNET,
      gas: config.constants.tomochainTestnet.MAX_GAS,
      gasPrice: config.constants.tomochainTestnet.DEFAULT_GAS_PRICE,
    },
  },
}
