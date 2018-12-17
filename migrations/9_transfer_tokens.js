const config = require('../config');

module.exports = function(deployer, network, accounts) {
  deployer.then(async () => {
    // example of transfer AE to admin
    // AE.at('0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d').then(async token => {
    //   await token.transfer(admin, 1000000e18, { from: admin });
    // });

    const admin = network === 'development' ? accounts[0] : accounts[1];
    // web3.personal.unlockAccount(admin, '123456789', 10000);

    // only transfer base tokens
    const tokens = config.getTokenContracts(artifacts, config.baseTokens);

    let addresses = config.accounts.development;

    const promises = tokens.map(token => {
      return token.deployed();
    });

    const deployedTokens = await Promise.all(promises);

    // console.log(admin, addresses)

    let tokenTransfers = [];

    for (let token of deployedTokens) {
      for (let address of addresses) {
        tokenTransfers.push(
          token.transfer(address, 1000000e18, {
            from: admin
          })
        );
      }
    }

    await Promise.all(tokenTransfers);
  });
};
