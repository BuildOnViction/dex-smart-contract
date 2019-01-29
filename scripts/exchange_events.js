const { Wallet, Contract, utils } = require('ethers')
const { Exchange } = require('../utils/abis')
const { contractAddresses } = require('../config')
const { getNetworkID, getPrivateKeyFromEnvironment, getProvider } = require('../utils/helpers')

const network = process.argv[2]
if (!network) throw new Error('Usage: node exchange_events.js {network}')

const networkID = getNetworkID(network)
const pk = getPrivateKeyFromEnvironment(network)
const addresses = contractAddresses[networkID]
const provider = getProvider(network)
const signer = new Wallet(pk, provider)

const testExchange = async () => {
  try {
    const exchange = new Contract(addresses['Exchange'], Exchange, signer)

    exchange.on('LogError', (errorId, makerOrderHash, takerOrderHash) => {
      console.log('LogError: ', errorId)
      console.log(makerOrderHash)
      console.log(takerOrderHash)
    })

    exchange.on('LogBatchTrades', (makerOrderHashes, takerOrderHashes, tokenPairHash) => {
      console.log(makerOrderHashes)
      console.log(takerOrderHashes)
      console.log(tokenPairHash)
    })

    exchange.on('LogOperatorUpdate', (operator, isOperator) => {
      console.log(operator)
      console.log(isOperator)
    })

    exchange.on('LogRewardAccountUpdate', (oldRewardAccount, newRewardAccount) => {
      console.log('oldRewardAccount: ' + oldRewardAccount)
      console.log('newRewardAccount: ' + newRewardAccount)
    })

    exchange.on('LogTest', (test) => {
      console.log('LogTest: ' + test)
    })
  } catch (err) {
    console.log(err)
  }
}

testExchange().then(() => console.log('Done'))
