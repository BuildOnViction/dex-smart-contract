const fs = require('fs')
const path = require('path');
const { utils, providers, Wallet, Contract } = require('ethers')
const { ERC20, Exchange } = require('../utils/abis')
const { getNetworkID, getPrivateKeyFromEnvironment, getProvider } = require('../utils/helpers')
const { contractAddresses, baseTokens, quoteTokens, decimals } = require('../config')

const network = process.argv[2]

if (!network) console.log('Usage: node register_pairs {network}')

const networkID = getNetworkID(network)
const pk = getPrivateKeyFromEnvironment(network)

const addresses = contractAddresses[networkID]
const provider = getProvider(network)
const signer = new Wallet(pk, provider)

console.log(addresses)

let exchange = new Contract(addresses['Exchange'], Exchange, signer)

const registerPairs = async () => {
  for (let quoteTokenSymbol of quoteTokens) {
    for (let baseTokenSymbol of baseTokens) {
      baseTokenDecimals = decimals[baseTokenSymbol]
      quoteTokenDecimals = decimals[quoteTokenSymbol]
      baseTokenAddress = addresses[baseTokenSymbol]
      quoteTokenAddress = addresses[quoteTokenSymbol]

      let defaultPricepointMultiplier = utils.bigNumberify(1e9)
      let decimalsPricepointMultiplier = utils.bigNumberify((10 ** (baseTokenDecimals - quoteTokenDecimals)).toString())
      let pricepointMultiplier = defaultPricepointMultiplier.mul(decimalsPricepointMultiplier)

      let tx = await exchange.registerPair(baseTokenAddress, quoteTokenAddress, pricepointMultiplier)
      let receipt = await signer.provider.waitForTransaction(tx.hash)

      if (receipt.status === 1) {
        console.log(`${baseTokenSymbol}/${quoteTokenSymbol} registration successful`)
        } else {
        console.log(`${baseTokenSymbol}/${quoteTokenSymbol} registration failed`)
      }
    }
  }
}

registerPairs()

