const WETH = artifacts.require('./contracts/utils/WETH.sol');

module.exports = function (deployer, network, accounts) {

  // if (network === 'development') return

  WETH.deployed().then(async weth => {

    let deposits = [];

    for (let account of accounts) {
      // web3.personal.unlockAccount(account, '123456789', 10000);
      deposits.push(
        weth.deposit({
          from: account,
          value: 10000e18
        })
      );
    }

    await Promise.all(deposits);
  });
};