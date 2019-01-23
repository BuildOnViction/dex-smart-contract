const config = require('../config')

module.exports = function (deployer, network, accounts) {
  deployer.then(async () => {
    const admin = accounts[0]
    // web3.personal.unlockAccount(admin, '123456789', 10000);
    const tokens = config.getTokenContracts(artifacts, config.tokens)

    const promises = tokens.map(token => {
      return deployer.deploy(token, admin, 10000000000e18)
    })

    await Promise.all(promises)
  })
}
