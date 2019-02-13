require('dotenv').config()

const contractAddresses = require('./contractAddresses.json')

// const quoteTokens = ['WETH', 'DAI', 'TUSD', 'USDC'];
const quoteTokens = []
const baseTokens = [
  'ETH',
  // 'AE',
  // 'BAT',
  // 'BNB',
  // 'GNT',
  // 'KNC',
  // 'LOOM',
  // 'LRC',
  // 'MITH',
  // 'MKR',
  // 'NPXS',
  // 'OMG',
  // 'PRFT',
  // 'REP',
  // 'SNT',
  // 'WTC',
  // 'ZRX',
]

const decimals = {
  AE: 18,
  BAT: 18,
  BNB: 18,
  DAI: 18,
  GNT: 18,
  KNC: 18,
  LOOM: 18,
  LRC: 18,
  MITH: 18,
  MKR: 18,
  NPXS: 18,
  OMG: 18,
  PRFT: 18,
  REP: 18,
  SNT: 18,
  WETH: 18,
  WTC: 18,
  ZRX: 18,
  TUSD: 18,
  USDC: 6,
}

const rewardAddresses = {
  '1': '',
  '8888': '0xD3050147F1AC4c552941930C7b27386dE8A710b8',
}

const keys = {
  '1': (process.env.TOMO_MAINNET_KEYS || '').split(','),
  '4': (process.env.TOMO_RINKEBY_KEYS || '').split(','),
  '8888': [],
}

let tokenContracts = null
const getTokenContracts = (artifacts, filters) => {
  if (tokenContracts === null) {
    tokenContracts = [
      artifacts.require('../contracts/tokens/ETH.sol'),
      artifacts.require('../contracts/tokens/OMG.sol'),
      artifacts.require('../contracts/tokens/BNB.sol'),
      artifacts.require('../contracts/tokens/ZRX.sol'),
      artifacts.require('../contracts/tokens/AE.sol'),
      artifacts.require('../contracts/tokens/TRX.sol'),
      artifacts.require('../contracts/tokens/MKR.sol'),
      artifacts.require('../contracts/tokens/BAT.sol'),
      artifacts.require('../contracts/tokens/REP.sol'),
      artifacts.require('../contracts/tokens/BTM.sol'),
      artifacts.require('../contracts/tokens/NPXS.sol'),
      artifacts.require('../contracts/tokens/WTC.sol'),
      artifacts.require('../contracts/tokens/KCS.sol'),
      artifacts.require('../contracts/tokens/GNT.sol'),
      artifacts.require('../contracts/tokens/PPT.sol'),
      artifacts.require('../contracts/tokens/SNT.sol'),
      artifacts.require('../contracts/tokens/DGX.sol'),
      artifacts.require('../contracts/tokens/MITH.sol'),
      artifacts.require('../contracts/tokens/AION.sol'),
      artifacts.require('../contracts/tokens/LRC.sol'),
      artifacts.require('../contracts/tokens/FUN.sol'),
      artifacts.require('../contracts/tokens/KNC.sol'),
      artifacts.require('../contracts/tokens/LOOM.sol'),
      artifacts.require('../contracts/tokens/DAI.sol'),
    ]
  }
  if (!filters) return tokenContracts
  return tokenContracts.filter(tokenContract =>
    filters.includes(tokenContract.contractName),
  )
}

module.exports = {
  quoteTokens,
  baseTokens,
  tokens: [...baseTokens, ...quoteTokens],
  decimals,
  rewardAddresses,
  contractAddresses,
  keys,
  // truffle config
  infura: {
    ethereum: 'https://mainnet.infura.io/Oi27hEUIuGqMsrYGpI7e',
    ropsten: 'https://ropsten.infura.io/Oi27hEUIuGqMsrYGpI7e',
    rinkeby: 'https://rinkeby.infura.io/Oi27hEUIuGqMsrYGpI7e',
    kovan: 'https://kovan.infura.io/Oi27hEUIuGqMsrYGpI7e',
  },
  constants: {
    DEFAULT_GAS: 4.5 * 10 ** 6,
    MAX_GAS: 6.0 * 10 ** 6,
    DEFAULT_LOW_GAS_PRICE: 0.1 * 10 ** 9,
    DEFAULT_GAS_PRICE: 15 * 10 ** 9,
    DEFAULT_HIGH_GAS_PRICE: 9 * 10 ** 9,
    TOKENS_ALLOCATED_TO_PROOF: 1181031 * 10 ** 18,
    DECIMALS_POINTS: 10 ** 18,
    TOKEN_UNITS: 10 ** 18,
    ETHER: 10 ** 18,
  },
  accounts: {
    marketMaker: [
      '0x7d8d88fA6726c8853d3f382e4915f43f4D549d0e',
    ],
    development: [
      '0xF069080F7acB9a6705b4a51F84d9aDc67b921bDF',
      '0x657B4CbA193CCac878a3561F36329Facd6D19825',
    ],
    rinkeby: [],
    ropsten: [],
    ethereum: [],
  },
  getTokenContracts,
}
