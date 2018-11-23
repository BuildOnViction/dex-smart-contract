const fs = require('fs')
const path = require('path');
const { utils, providers, Wallet, Contract } = require('ethers')
const { Exchange } = require('../utils/abis')
const { operatorAddresses } = require('../config')
const { getNetworkID, getPrivateKeyFromEnvironment, getProvider } = require('../utils/helpers')

const network = process.argv[2]
if (!network) throw new Error('Usage: node show_operator_balances.js {network}')

const pk = getPrivateKeyFromEnvironment(network)
const networkID = getNetworkID(network)
const provider = getProvider(network)
const operators = operatorAddresses[networkID]

const show = async () => {
  for (let operator of operators) {
    let balance = await provider.getBalance(operator)
    console.log(`${operator}: ${utils.formatEther(balance)} ETH`)
  }
}

console.log('\n')

show()