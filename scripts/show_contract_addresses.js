const process = require('process')
const contractAddresses = require('../config/contractAddresses.json')
const network = process.argv[2]
const { getNetworkID } = require('../utils/helpers')


if (!process.argv[2]) console.log('Usage: node show_contract_addresses {network}')

const networkId = getNetworkID(network)
if (!networkId) console.log('Network not found')

const addresses = contractAddresses[networkId]
Object.keys(addresses).forEach(symbol => console.log(`${symbol}: ${addresses[symbol]}`))
console.log('\n')