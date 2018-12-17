const Exchange = artifacts.require('./contracts/Exchange.sol');
const RewardCollector = artifacts.require('./contracts/RewardCollector.sol');
const RewardPools = artifacts.require('./contracts/RewardPools.sol');
const RELA = artifacts.require('./contracts/tokens/RELA.sol');

module.exports = function(deployer, network, accounts) {
  // const admin = network === 'development' ? accounts[0] : accounts[1];
  // web3.personal.unlockAccount(admin, '123456789', 10000);

  deployer.deploy(RewardCollector).then(async rewardCollector => {
    // if (network === 'ethereum') {
    //   return deployer.deploy(RewardPools, tokenAddress, rewardCollector.address)
    // } else {
    const tomoToken = await RELA.deployed();
    return deployer.deploy(
      RewardPools,
      tomoToken.address,
      rewardCollector.address
    );
    // }
  });
};
