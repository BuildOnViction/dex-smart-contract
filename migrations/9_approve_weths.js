const Exchange = artifacts.require('./Exchange.sol')
const WETH = artifacts.require('./contracts/utils/WETH.sol')

module.exports = function (deployer, network, accounts) {
  let weth
  let exchange

  if (network === 'development') return

  WETH.deployed()
    .then(async (_weth) => {
      const approvals = []
      weth = _weth
      exchange = await Exchange.deployed()

      for (const account of accounts) {
        approvals.push(weth.approve(exchange.address, 500000e18, { from: account }))
      }

      await Promise.all(approvals)
    })
}
