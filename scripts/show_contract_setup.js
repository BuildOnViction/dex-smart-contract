const fs = require('fs')
const path = require('path');
const { utils, providers, Wallet, Contract } = require('ethers')
const { RewardPools, RewardCollector, Exchange } = require('./abis')
const { contractAddresses } = require('../config')
const { getNetworkID, getPrivateKeyFromEnvironment, getProvider } = require('../utils/helpers')

const network = process.argv[2]
if (!network) throw new Error('Usage: node show_contract_setup {network}')

const networkID = getNetworkID(network)
const pk = getPrivateKeyFromEnvironment(network)

const addresses = contractAddresses[networkID]
let provider = getProvider(network)
let signer = new Wallet(pk, provider)

const show = async () => {
  let rewardPools = new Contract(addresses['RewardPools'], RewardPools)
  let exchange = new Contract(addresses['Exchange'], Exchange)
        let rewardCollector = new Contract(addresses['RewardCollector'], RewardCollector)

  let exchangeOwner = await exchange.owner.call()  
  let exchangeRewardAccount = await exchange.rewardAccount.call()
  let rewardPoolsOwner = await rewardPools.owner.call()
  let rewardCollectorOwner = await rewardCollector.owner.call()
  let rewardPoolsAddress = await rewardCollector.rewardPools.call()
  let rewardPoolsOwner = await rewardPools.owner.call()
  let currentEpoch = await rewardPools.currentEpoch.call()
  let currentPoolIndex = await rewardPools.currentPoolIndex.call()
  let currentPoolBalance = await rewardPools.currentPoolBalance.call()
  let rewardPoolsBlocksPerEpochSetting = await rewardPools.blocksPerEpoch.call()
  let creationBlockNumber = await rewardPools.creationBlockNumber.call()
  


  console.log('**Exchange**')
  console.log('Owner: ', exchangeOwner)
  console.log('Reward Account: ', rewardAccount)

  console.log('**RewardCollector**')
  console.log('Owner: ', rewardCollectorOwner)

  console.log('**RewardPools**')
  console.log('Owner: ', rewardPoolsOwner)
  console.log('RewardCollector Setting: ', rewardPoolsAddress)
  console.log('Blocks per Epoch Setting', blocksPerEpoch)
  console.log('Current Pool Index', currentPoolIndex)
  console.log('Current Pool Balance', currentPoolBalance)
  console.log('Current Epoch', currentEpoch)
}

show()