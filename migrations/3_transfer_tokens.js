const config = require('../config')

const toTxHash = (value) => {
  if (typeof value === 'string') {
    // this is probably a tx hash already
    return value
  } else if (typeof value.receipt === 'object') {
    // this is probably a tx object
    return value.receipt.transactionHash
  }
  throw new Error('Unsupported tx type: ' + value)
}

const mineTx = (promiseOrTx, interval) => {
  return Promise.resolve(promiseOrTx)
    .then(tx => {
      const txHash = toTxHash(tx)

      return new Promise((resolve, reject) => {
        const getReceipt = () => {
          web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
            if (error) {
              reject(error)
            } else if (receipt) {
              resolve(receipt)
            } else {
              setTimeout(getReceipt, interval || 500)
            }
          })
        }

        getReceipt()
      })
    })
}

module.exports = function (deployer, network, accounts) {
  deployer.then(async () => {
    const admin = accounts[0]

    let addresses = []
    if (network === 'development') {
      addresses = config.accounts.development
    }
    console.log(addresses)

    const tokens = config.getTokenContracts(artifacts, config.tokens)

    const promises = tokens.map(token => {
      return token.deployed()
    })

    const deployedTokens = await Promise.all(promises)

    const transfers = []

    try {
      for (const deployedToken of deployedTokens) {
        for (const address of addresses) {
          // Transfer 100,000 tokens to other accounts in config file
          transfers.push(deployedToken.transfer(address, 1e5 * 1e18, { from: admin }))
        }

        for (const marketMaker of config.accounts.marketMaker) {
          // Transfer 1,000,000 tokens to market maker accounts in config file
          transfers.push(deployedToken.transfer(marketMaker, 1e6 * 1e18, { from: admin }))
        }
      }

      await Promise.all(transfers)
    } catch (e) {
      console.log(e.message)
    }
  })
}
