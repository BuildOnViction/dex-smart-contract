// Allows us to use ES6 in our migrations and tests.
require('babel-register')

// Allows us to use ES6 in our migrations and tests.
require('dotenv').config()
const config = require('./config')
const secret = require('./secret-config')

require('babel-register')
require('babel-polyfill')

const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '8888',
      gas: config.constants.MAX_GAS,
      gasPrice: config.constants.DEFAULT_GAS_PRICE,
      from: '0xF9D87abd60435b70415CcC1FAAcA4F8B91786eDb', // testprc main account here
    },
    ethereum: {
      provider: () => new HDWalletProvider(secret.ethereum.mnemonic, config.rpcEndpoints.ethereum),
      network_id: '1',
      gas: config.constants.MAX_GAS,
      gasPrice: config.constants.DEFAULT_GAS_PRICE,
    },
    ropsten: {
      provider: () => new HDWalletProvider(secret.ropsten.mnemonic, config.rpcEndpoints.ropsten),
      gas: config.constants.MAX_GAS,
      gasPrice: config.constants.DEFAULT_GAS_PRICE,
      network_id: '3',
    },
    rinkeby: {
      provider: () => new HDWalletProvider(secret.rinkeby.mnemonic, config.rpcEndpoints.rinkeby),
      gas: config.constants.MAX_GAS,
      gasPrice: config.constants.DEFAULT_GAS_PRICE,
      network_id: '4',
    },
    tomochain: {
      provider: () => new HDWalletProvider(secret.tomochain.mnemonic, config.rpcEndpoints.tomochain),
      gas: config.constants.MAX_GAS,
      gasPrice: config.constants.DEFAULT_GAS_PRICE,
      network_id: '88',
    },
    tomochainTestnet: {
      provider: () => new HDWalletProvider(secret.tomochainTestnet.mnemonic, config.rpcEndpoints.tomochainTestnet),
      gas: config.constants.MAX_GAS,
      gasPrice: config.constants.DEFAULT_GAS_PRICE,
      network_id: '89',
    },
  },
}
