const config = require('../config')
const Exchange = artifacts.require('./Exchange.sol')

module.exports = function (deployer, network, accounts) {
  deployer.then(async () => {
    // const admin = network === 'development' ? accounts[0] : accounts[1];
    // web3.personal.unlockAccount(admin, '123456789', 10000);

    const tokens = config.getTokenContracts(artifacts, config.tokens)

    const exchange = await Exchange.deployed()
    const promises = tokens.map(token => {
      return token.deployed()
    })

    const deployedTokens = await Promise.all(promises)

    const tokenApprovals = []
    // let addresses = config.accounts.development

    for (const token of deployedTokens) {
      for (const account of accounts) {
        tokenApprovals.push(
          token.approve(exchange.address, 1000000e18, {
            from: account,
          }),
        )
      }

      // for (let address of addresses) {
      //   tokenApprovals.push(
      //     token.approve(exchange.address, 1000000e18, {
      //       from: address
      //     })
      //   );
      // }
    }

    try {
      await Promise.all(tokenApprovals)
    } catch (e) {
      console.log(e)
    }
  })
}
