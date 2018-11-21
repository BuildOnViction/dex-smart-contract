let config = {
  infura: {
    ethereum: 'https://mainnet.infura.io/Oi27hEUIuGqMsrYGpI7e',
    ropsten: 'https://ropsten.infura.io/Oi27hEUIuGqMsrYGpI7e',
    rinkeby: 'https://rinkeby.infura.io/Oi27hEUIuGqMsrYGpI7e',
    kovan: 'https://kovan.infura.io/Oi27hEUIuGqMsrYGpI7e'
  },
  constants: {
    DEFAULT_GAS: 4.5 * 10 ** 6,
    MAX_GAS: 6.0 * 10 ** 6,
    DEFAULT_LOW_GAS_PRICE: 0.1 * 10 ** 9,
    DEFAULT_GAS_PRICE: 15 * 10 ** 9,
    DEFAULT_HIGH_GAS_PRICE: 9 * 10 ** 9,
    TOKENS_ALLOCATED_TO_PROOF: 1181031 * (10 ** 18),
    DECIMALS_POINTS: 10 ** 18,
    TOKEN_UNITS: 10 ** 18,
    ETHER: 10 ** 18
  },
  ipfs: {
    PRODUCTION: 'QmUM5eT3vY9NfeJ9JBg8xcrom3jEZ3J86wRtNPsFBJ6QFo',
    TESTING_SUCCESS: 'QmVuyH2JtbTguZuC5HsefNBbu8SNSUdq6mrHHDhGeLob3V',
    TESTING_FAIL: 'QmUGo9mjcdc232p4YUgGf5mdZ5aAvVrVpp8AXiN4AuvBZd'
  },
  accounts: {
    development: [
      '0x6e6bb166f420ddd682caebf55dafbafda74f2c9c'
    ],
    rinkeby: [],
    ropsten: [],
    ethereum: []
  }
}

module.exports = config