const fs = require('fs')
const path = require('path')
const { utils, providers } = require('ethers')
const truffleBuildPath = path.join(__dirname, '../build/contracts')
const files = fs.readdirSync(truffleBuildPath)
const otherContracts = [
  'Owned.json',
  'Migrations.json',
  'SafeMath.json',
  'ProofToken.json',
  'RewardCollector.json',
  'ApproveAndCallReceiver.json',
]
const { contractAddresses } = require('../config/contractAddresses.json')
const Web3 = require('web3')

const getNetworkID = networkName => {
  return {
    mainnet: '1',
    homestead: '1',
    rinkeby: '4',
    local: '8888',
  }[networkName]
}

const getProvider = networkName => {
  switch (networkName) {
    case 'local':
      return new providers.Web3Provider(
                new Web3.providers.HttpProvider('http://localhost:8545'),
                { chainId: 8888 },
            )
    default:
      return new providers.InfuraProvider(networkName)
  }
}

const getPrivateKeyFromEnvironment = networkName => {
  switch (networkName) {
    case 'mainnet':
      return process.env.TOMO__MAINNET_PRIVATE_KEY
    case 'rinkeby':
      return process.env.TOMO__RINKEBY_PRIVATE_KEY
    case 'local':
      return process.env.TOMO__LOCAL_PRIVATE_KEY
    default:
      throw new Error('Could not get private key from environment')
  }
}

const getPriceMultiplier = (baseTokenDecimals, quoteTokenDecimals) => {
  const defaultPricepointMultiplier = utils.bigNumberify(1e9)
  const decimalsPricepointMultiplier = utils.bigNumberify(
        (10 ** (baseTokenDecimals - quoteTokenDecimals)).toString(),
    )

  return defaultPricepointMultiplier.mul(decimalsPricepointMultiplier)
}

// file corresponds to a token if it is not in the `otherContracts` array
const isToken = file => {
  return otherContracts.indexOf(file) === -1
}

const getRinkebyAddresses = () => {
  return contractAddresses['4']
}

const getMainnetAddresses = () => {
  return contractAddresses['1']
}

const queryContractAddresses = () => {
  const contracts = { '8888': {}, '1000': {}, '4': {}, '1': {} }

    // Configuration for testnets based on local truffle project
  files.forEach((file, index) => {
    let address
    let symbol
    const json = JSON.parse(
            fs.readFileSync(`${truffleBuildPath}/${file}`, 'utf8'),
        )

    if (json.networks['8888']) {
      if (isToken(file)) {
        symbol = file.slice(0, -5)
        if (symbol === 'WETH9') symbol = 'WETH'

        address = json.networks['8888'].address
        contracts['8888'][symbol] = utils.getAddress(address)
      }
    }

    if (json.networks['1000']) {
      if (isToken(file)) {
        symbol = file.slice(0, -5)
        if (symbol === 'WETH9') symbol = 'WETH'
        address = json.networks['1000'].address
        contracts['1000'][symbol] = utils.getAddress(address)
      }
    }

    if (json.networks['4']) {
      if (isToken(file)) {
        symbol = file.slice(0, -5)
        if (symbol === 'WETH9') symbol = 'WETH'
        address = json.networks['4'].address
        contracts['4'][symbol] = utils.getAddress(address)
      }
    }
  })

    // Configuration for mainnet tokens
  contracts['1'] = {
    AE: '0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d',
    BAT: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
    BNB: ' 0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    DAI: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
    Exchange: '0x0',
    RewardPools: '0x0',
    RewardCollector: '0x0',
    GNT: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
    KNC: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
    LOOM: '0xa4e8c3ec456107ea67d3075bf9e3df3a75823db0',
    LRC: '0xef68e7c694f40c8202821edf525de3782458639f',
    MITH: '0x3893b9422cd5d70a81edeffe3d5a1c6a978310bb',
    MKR: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    NPXS: '0xa15c7ebe1f07caf6bff097d8a589fb8ac49ae5b3',
    OMG: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
    PRFT: '0xc5cea8292e514405967d958c2325106f2f48da77',
    REP: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
    SNT: '0x744d70fdbe2ba4cf95131626614a1763df805b9e',
    WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    WTC: '0xb7cb1c96db6b22b0d3d9536e0108d062bd488f74',
    ZRX: '0xe41d2489571d322189246dafa5ebde1f4699f498',
    TUSD: '0x8dd5fbce2f6a956c3022ba3663759011dd51e73e',
    USDC: '0x0',
  }
  const contractAddressFile = path.join(
        __dirname,
        '../config/contractAddresses.json',
    )
  fs.writeFileSync(contractAddressFile, JSON.stringify(contracts), 'utf8')
}

module.exports = {
  getNetworkID,
  getProvider,
  getPriceMultiplier,
  getMainnetAddresses,
  getRinkebyAddresses,
  queryContractAddresses,
  getPrivateKeyFromEnvironment,
}
