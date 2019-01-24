const WETH = artifacts.require('./contracts/utils/WETH.sol')
// const config = require('../config')

module.exports = function (deployer, network, accounts) {
  // if (network === 'development') return

  WETH.deployed().then(async weth => {
    const deposits = []

    for (const account of accounts) {
      web3.personal.unlockAccount(account, '123456789', 10000)
      deposits.push(weth.deposit({ from: account, value: 1e7 * 1e18 }), // 10,000,000 WETH for admin
      )
    }

    // const addresses = config.accounts.development
    // for (const address of addresses) {
    //   deposits.push(weth.deposit({ from: address, value: 1e2 * 1e18 }), // Other accounts in config file
    //   )
    // }

    await Promise.all(deposits)
  })
}
