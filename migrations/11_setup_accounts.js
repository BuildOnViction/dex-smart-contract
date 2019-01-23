const Exchange = artifacts.require('./contracts/Exchange.sol')
const RELAToken = artifacts.require('./contracts/tokens/RELA.sol')
const SetupAccount = artifacts.require('./contracts/utils/SetupAccount.sol')
const WETH = artifacts.require('./contracts/utils/WETH.sol')

module.exports = function (deployer, network, accounts) {
  const admin = accounts[0]
  let proofToken, rewardCollector, rewardPools

  deployer.then(function () {
    return Exchange.deployed()
  })
    .then(async (exchange) => {
      if (network === 'ethereum') {
        const wethAddress = '0x53DDd545882dec853226dC8255268C7760276695'
        return deployer.deploy(SetupAccount, exchange.address, weth.address)
      }
      const weth = await WETH.deployed()
      console.log(exchange.address)
      console.log(weth.address)
      return deployer.deploy(SetupAccount, exchange.address, weth.address)
    })
}
