const Exchange = artifacts.require('./contracts/Exchange.sol');
const TOMO = artifacts.require('./contracts/tokens/TOMO.sol');
const RewardPools = artifacts.require('./contracts/RewardPools.sol');


module.exports = function (deployer, network, accounts) {
  let admin = accounts[0]

  deployer.then(function () {
      return RewardPools.deployed()
    })
    .then(async (rewardPools) => {

      const tomoToken = await TOMO.deployed()
      return deployer.deploy(Exchange, tomoToken.address)

    })
}