const { Wallet, Contract, utils } = require('ethers')

const { contractAddresses } = require('../config')
const { ERC20 } = require('../utils/abis')
const { getNetworkID, getPrivateKeyFromEnvironment, getProvider } = require('../utils/helpers')
const accounts = require('../config').accounts.development

const network = process.argv[2]
if (!network) throw new Error('Usage: node test_exchange.js {network}')

const networkID = getNetworkID(network)
const pk = getPrivateKeyFromEnvironment(network)
const addresses = contractAddresses[networkID]
const provider = getProvider(network)
const signer = new Wallet(pk, provider)

const queryTokenBalances = async () => {
  try {
    for (const account of accounts) {
      console.log(`**${account}**`)
      for (const symbol in addresses) {
        if (!['Exchange', 'RewardPools', 'SetupAccount', 'RELA'].includes(symbol)) {
          const token = new Contract(addresses[symbol], ERC20, signer)
          const balance = await token.balanceOf(account)
          console.log(`${symbol}: ${balance}`)
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
}

queryTokenBalances()
