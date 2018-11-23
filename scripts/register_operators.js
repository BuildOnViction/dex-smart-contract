const fs = require('fs')
const path = require('path');
const { utils, providers, Wallet, Contract } = require('ethers')
const { Exchange } = require('../utils/abis')
const { contractAddresses, operatorsAddresses, operatorAddresses } = require('../config')
const { getNetworkID, getPrivateKeyFromEnvironment, getProvider } = require('../utils/helpers')


const network = process.argv[2]
if (!network) throw new Error('Usage: node register_operators.js {network}')

const networkID = getNetworkID(network)
const pk = getPrivateKeyFromEnvironment(network)
const addresses = contractAddresses[networkID]
const operators = operatorAddresses[networkID]
// '63739bbdf74143aeb0e6d8bb8307084f'
// console.log(operators)
const provider = getProvider(network)
const signer = new Wallet(pk, provider)

const setOperators = async () => {
  for (let operator of operators) {
    let exchange = new Contract(addresses['Exchange'], Exchange, signer)    
    let tx = await exchange.setOperator(operator, true)
    let receipt = await signer.provider.waitForTransaction(tx.hash)

    if (receipt.status === 0) {
      console.log(`Transaction ${tx.hash} failed`)
    } else {
      console.log(`${operator} is now an operator`)
    }
  }
}

setOperators()


