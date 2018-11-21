const Exchange = artifacts.require('./contracts/Exchange.sol');
const RewardCollector = artifacts.require('./contracts/RewardCollector.sol');
const RewardPools = artifacts.require('./contracts/RewardPools.sol');
const TOMO = artifacts.require('./contracts/tokens/TOMO.sol');


module.exports = function (deployer, network, accounts) {
  let admin = accounts[0]

  deployer.deploy(RewardCollector)
    .then(async (rewardCollector) => {
      // if (network === 'ethereum') {
      //   return deployer.deploy(RewardPools, tokenAddress, rewardCollector.address)
      // } else {
      const tomoToken = await TOMO.deployed()
      return deployer.deploy(RewardPools, tomoToken.address, rewardCollector.address)
      // }
    })
}