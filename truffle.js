// Allows us to use ES6 in our migrations and tests.
require('babel-register')

// Allows us to use ES6 in our migrations and tests.
require('dotenv').config()
const config = require('./config')
const secret = require('./config/secret')

require('babel-register')
require('babel-polyfill')

const net = require('net')
const Web3 = require('web3')

const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  networks: {
    development: {
      provider: () =>
        new Web3.providers.IpcProvider(process.env.NETWORK_DEVELOPMENT_IPC_PATH, net),
      network_id: config.NETWORK_ID.DEVELOPMENT,
      gas: config.constants.development.DEFAULT_GAS,
      gasPrice: config.constants.development.DEFAULT_GAS_PRICE,
    },
    tomochain: {
      provider: () => new HDWalletProvider(secret.tomochain.mnemonic, config.rpcEndpoints.tomochain),
      network_id: config.NETWORK_ID.TOMOCHAIN,
      gas: config.constants.tomochain.DEFAULT_GAS,
      gasPrice: config.constants.tomochain.DEFAULT_GAS_PRICE,
    },
    tomochainTestnet: {
      provider: () => new HDWalletProvider(secret.tomochainTestnet.mnemonic, config.rpcEndpoints.tomochainTestnet),
      network_id: config.NETWORK_ID.TOMOCHAIN_TESTNET,
      gas: config.constants.tomochainTestnet.DEFAULT_GAS,
      gasPrice: config.constants.tomochainTestnet.DEFAULT_GAS_PRICE,
    },
  },
}
