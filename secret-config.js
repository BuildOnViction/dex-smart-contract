let config = {
  rinkeby: {
    keystore: process.env.RINKEBY_KEYSTORE,
    password: process.env.RINKEBY_PASSWORD
  },
  ropsten: {
    keystore: process.env.ROPSTEN_KEYSTORE,
    password: process.env.ROPSTEN_PASSWORD
  },
  ethereum: {
    keystore: process.env.ETHEREUM_KEYSTORE,
    password: process.env.ETHEREUM_PASSWORD
  }
}

module.exports = config
