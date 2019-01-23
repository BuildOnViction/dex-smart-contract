const WETH = artifacts.require('./contracts/utils/WETH.sol')
// const config = require('../config')

module.exports = function (deployer, network, accounts) {
  // if (network === 'development') return

  WETH.deployed().then(async weth => {
    const deposits = []

    for (const account of accounts) {
      web3.personal.unlockAccount(account, '123456789', 10000)
      deposits.push(
        weth.deposit({
          from: account,
          value: 10000000e18,
        }),
      )
    }

    // let addresses = config.accounts.development
    // for (let address of addresses) {
    //   deposits.push(
    //     weth.deposit({
    //       from: address,
    //       value: 10000e18
    //     })
    //   );
    // }

    await Promise.all(deposits)
  })
}
