const fs = require('fs')
const path = require('path')
const argv = require('yargs').argv
const { utils, providers, Wallet, Contract } = require('ethers')
const { Exchange } = require('../utils/abis')
const { contractAddresses, rewardAddresses } = require('../config')
const { getNetworkID, getPrivateKeyFromEnvironment, getProvider } = require('../utils/helpers')

const network = argv.network
if (!network) throw new Error('Usage: node register_operators.js {network}')

const networkID = getNetworkID(network)
const pk = getPrivateKeyFromEnvironment(network)
const addresses = contractAddresses[networkID]

const provider = getProvider(network)
const signer = new Wallet(pk, provider)

const setRewardAccount = async () => {
  try {
    const rewardAccount = rewardAddresses[networkID]
    const exchange = new Contract(addresses['Exchange'], Exchange, signer)
    const tx = await exchange.setRewardAccount(rewardAccount)
    const receipt = await signer.provider.waitForTransaction(tx.hash)

    if (receipt.status === 0) {
      console.log(`Transaction ${tx.hash} failed`)
    } else {
      console.log(`${rewardAccount} is now the reward account`)
    }
  } catch (err) {
    console.log(err)
  }
}

setRewardAccount()
