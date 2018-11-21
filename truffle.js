// Allows us to use ES6 in our migrations and tests.
require('babel-register');

// Allows us to use ES6 in our migrations and tests.
require('dotenv').config();
var config = require('./config');
var secret = require('./secret-config');

require('babel-register');
require('babel-polyfill');

const LightWalletProvider = require('@digix/truffle-lightwallet-provider');

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '8888',
      gas: config.constants.MAX_GAS,
      gasPrice: config.constants.DEFAULT_GAS_PRICE,
      from: '0x28074f8D0fD78629CD59290Cac185611a8d60109' // testprc main account here
    },
    development_node2: {
      host: 'localhost',
      port: 8545,
      network_id: '8888',
      gas: config.constants.MAX_GAS,
      gasPrice: config.constants.DEFAULT_GAS_PRICE,
      from: '0x6e6BB166F420DDd682cAEbf55dAfBaFda74f2c9c' // testprc main account here
    },
    development_geth: {
      host: 'localhost',
      port: 8545,
      network_id: '8888',
      gas: config.constants.MAX_GAS,
      gasPrice: config.constants.DEFAULT_GAS_PRICE,
      from: '0x6e6BB166F420DDd682cAEbf55dAfBaFda74f2c9c'
    },
    ethereum: {
      provider: new LightWalletProvider({
        keystore: secret.ethereum.keystore,
        password: secret.ethereum.password,
        rpcUrl: config.infura.ethereum
      }),
      network_id: '1',
      gas: config.constants.MAX_GAS,
      gasPrice: config.constants.DEFAULT_GAS_PRICE
    },
    ropsten: {
      provider: new LightWalletProvider({
        keystore: secret.ropsten.keystore,
        password: secret.ropsten.password,
        rpcUrl: config.infura.ropsten
      }),
      gas: config.constants.MAX_GAS,
      gasPrice: config.constants.DEFAULT_GAS_PRICE,
      network_id: '3'
    },
    rinkeby: {
      provider: new LightWalletProvider({
        keystore: secret.rinkeby.keystore,
        password: secret.rinkeby.password,
        rpcUrl: config.infura.rinkeby
      }),
      gas: config.constants.MAX_GAS,
      gasPrice: config.constants.DEFAULT_GAS_PRICE,
      network_id: '4'
    },
    coverage: {
      host: 'localhost',
      network_id: '*',
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01
    }
  }
};
