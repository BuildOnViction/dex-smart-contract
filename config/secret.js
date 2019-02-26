const config = {
  ethereum: {
    mnemonic: process.env.ETHEREUM_MNEMONIC,
  },
  ropsten: {
    mnemonic: process.env.ROPSTEN_MNEMONIC,
  },
  rinkeby: {
    mnemonic: process.env.RINKEBY_MNEMONIC,
  },
  tomochain: {
    mnemonic: process.env.TOMOCHAIN_MNEMONIC,
  },
  tomochainTestnet: {
    mnemonic: process.env.TOMOCHAIN_TESTNET_MNEMONIC,
  },
}

module.exports = config
