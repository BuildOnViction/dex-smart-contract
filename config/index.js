require('dotenv').config()

const contractAddresses = require('./contractAddresses.json')

// const quoteTokens = ['WETH', 'DAI', 'TUSD', 'USDC'];
const quoteTokens = ['WETH', 'DAI']
const baseTokens = [
  'AE',
  'BAT',
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
  'ZRX',
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

const operatorAddresses = {
  '1': [],
  '8888': ['0xF9D87abd60435b70415CcC1FAAcA4F8B91786eDb', '0xD3050147F1AC4c552941930C7b27386dE8A710b8'],
}

const rewardAddresses = {
  '1': '',
  '8888': '0xD3050147F1AC4c552941930C7b27386dE8A710b8',
}

const testAccounts = [
  '0xcc5697310277bcc3be506f53ed8aafc9d17a2c18',
  '0x3b89e78363d872c80c78c254bf1bb9ff9e586571',
  '0xf2934427c36ba897f9be6ed554ed2dbce3da1c68',
  '0xfa4f991caa4f37f7bce2e285e155da8c929658ef',
  '0xb21a999ba39015df00ee33e55caf08af86b46bfa',
  '0xdc64ae432d848cf38a89c6f30a04884e22e83c74',
  '0xbf8e9e3f9dbb85554679ce8147077b0496358f53',
  '0xc8b74b6b883a96e3defd62934ec3a1e44f149860',
  '0x53ee745b3d30d692dc016450fef68a898c16fa44',
  '0xe0a1240b358dfa6c167edea09c763ae9f3b51ea0',
]

const keys = {
  '1': (process.env.TOMO_MAINNET_KEYS || '').split(','),
  '4': (process.env.TOMO_RINKEBY_KEYS || '').split(','),
  '8888': [],
}

let tokenContracts = null
const getTokenContracts = (artifacts, filters) => {
  if (tokenContracts === null) {
    tokenContracts = [
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
  operatorAddresses,
  rewardAddresses,
  testAccounts,
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
  ipfs: {
    PRODUCTION: 'QmUM5eT3vY9NfeJ9JBg8xcrom3jEZ3J86wRtNPsFBJ6QFo',
    TESTING_SUCCESS: 'QmVuyH2JtbTguZuC5HsefNBbu8SNSUdq6mrHHDhGeLob3V',
    TESTING_FAIL: 'QmUGo9mjcdc232p4YUgGf5mdZ5aAvVrVpp8AXiN4AuvBZd',
  },
  accounts: {
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
