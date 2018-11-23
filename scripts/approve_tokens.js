const fs = require('fs')
const path = require('path');
const { utils, providers, Wallet, Contract } = require('ethers')
const { ERC20 } = require('../utils/abis')
const { contractAddresses, testAccounts } = require('../config')
const { getNetworkID, getPrivateKeyFromEnvironment, getProvider } = require('../utils/helpers')

const network = process.argv[2]
const amount = process.argv[3]
if (!network) console.log('Usage: node approve_tokens {network}')

const networkID = getNetworkID(network)
const pk = getPrivateKeyFromEnvironment(network)
const addresses = contractAddresses[networkID]
const accounts = testAccounts[networkID]

const provider = getProvider(network)
let signer = new Wallet(pk, provider)
let amount = amount || "100000000000000000000" // 100 * 1e18 (amount to approve)

const approveTokens = async () => {
  for (let account of accounts) {
    for (let symbol in addresses) {
      if (symbol !== 'Exchange') {
        let token = new Contract(addresses[symbol], ERC20, signer)
        let tx = await token.transfer(account, amount)
        let receipt = await signer.provider.waitForTransaction(tx.hash)

        if (receipt.status === 0) {
          console.log(`Transaction ${tx.hash} failed`)
        } else {
          console.log(`${amount} sent to ${account}`)
        }
      }
    }
  }
}

approveTokens()