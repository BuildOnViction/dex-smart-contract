const Exchange = artifacts.require('./contracts/Exchange.sol');
const RELA = artifacts.require('./contracts/tokens/RELA.sol');
const RewardPools = artifacts.require('./contracts/RewardPools.sol');

module.exports = function(deployer, network, accounts) {
  // const admin = network === 'development' ? accounts[0] : accounts[1];
  // web3.personal.unlockAccount(admin, '123456789', 10000);

  deployer
    .then(function() {
      return RewardPools.deployed();
    })
    .then(async rewardPools => {
      const tomoToken = await RELA.deployed();
      return deployer.deploy(Exchange, tomoToken.address);
    });
};
