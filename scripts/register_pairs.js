const fs = require('fs')
const path = require('path')
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

const exchange = new Contract(addresses['Exchange'], Exchange, signer)

const registerPairs = async () => {
  for (const quoteTokenSymbol of quoteTokens) {
    for (const baseTokenSymbol of baseTokens) {
      const baseTokenDecimals = decimals[baseTokenSymbol]
      const quoteTokenDecimals = decimals[quoteTokenSymbol]
      const baseTokenAddress = addresses[baseTokenSymbol]
      const quoteTokenAddress = addresses[quoteTokenSymbol]

      const defaultPricepointMultiplier = utils.bigNumberify(1e9)
      const decimalsPricepointMultiplier = utils.bigNumberify(
        (10 ** (baseTokenDecimals - quoteTokenDecimals)).toString(),
      )
      const pricepointMultiplier = defaultPricepointMultiplier.mul(decimalsPricepointMultiplier)

      const tx = await exchange.registerPair(baseTokenAddress, quoteTokenAddress, pricepointMultiplier)
      const receipt = await signer.provider.waitForTransaction(tx.hash)

      if (receipt.status === 1) {
        console.log(`${baseTokenSymbol}/${quoteTokenSymbol} registration successful`)
      } else if (receipt.root) { // Fix the case of before Byzantium hard fork
        console.log(`${baseTokenSymbol}/${quoteTokenSymbol} registration successful`)
      } else {
        console.log(`${baseTokenSymbol}/${quoteTokenSymbol} registration failed`)
      }
    }
  }
}

registerPairs()

