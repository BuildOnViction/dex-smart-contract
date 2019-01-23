const Migrations = artifacts.require('./Migrations.sol')

module.exports = function (deployer, network, accounts) {
  // if not using ganache, need unlock first
  // const admin = network === 'development' ? accounts[0] : accounts[1];
  // web3.personal.unlockAccount(admin, '123456789', 10000);
  deployer.deploy(Migrations)
}
