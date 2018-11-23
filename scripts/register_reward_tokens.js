const fs = require('fs')
const path = require('path');
const { utils, providers, Wallet, Contract } = require('ethers')
const { ERC20, Rewards } = require('../utils/abis')
const { contractAddresses, baseTokens, quoteTokens } = require('../config')
const { getNetworkID, getPrivateKeyFromEnvironment, getProvider } = require('../utils/helpers')

const network = process.argv[2]
if (!network) throw new Error('Usage: node register_reward_tokens.js {network}')

const networkID = getNetworkID(network)
const pk = getPrivateKeyFromEnvironment(network)
const addresses = contractAddresses[networkID]


const provider = getProvider(network)
const signer = new Wallet(pk, provider)
let rewards = new Contract(addresses['RewardPools'], Rewards, signer)

const registerPairs = async () => {
  for (let quoteTokenSymbol of quoteTokens) {
    quoteTokenAddress = addresses[quoteTokenSymbol]

    let tx = await rewards.registerQuoteToken(quoteTokenAddress)
    let receipt = await signer.provider.waitForTransaction(tx.hash)

    if (receipt.status === 1) {
      console.log(`${baseTokenSymbol}/${quoteTokenSymbol} registration successful`)
      } else {
      console.log(`${baseTokenSymbol}/${quoteTokenSymbol} registration failed`)
    }
  }
}

registerPairs()

