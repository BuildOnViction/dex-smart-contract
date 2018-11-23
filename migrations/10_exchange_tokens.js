const {
  getCancelOrderAddresses,
  getCancelOrderValues,
  getOrderHash,
  getTradeHash,
  getMatchOrderAddresses,
  getMatchOrderValues
} = require('../test/utils/exchange')

const { getBalances } = require('../test/utils/balances')
const Web3 = require('web3')
const Exchange = artifacts.require('./contracts/Exchange.sol');
const WETH = artifacts.require('./contracts/utils/WETH.sol');
const AE = artifacts.require('./contracts/tokens/AE.sol');
const AION = artifacts.require('./contracts/tokens/AION.sol');

module.exports = function (deployer, network, accounts) {

  // const admin = network === 'development' ? accounts[0] : accounts[1];
  // web3.personal.unlockAccount(admin, '123456789', 10000);

  deployer.then(function () {
      return Exchange.deployed()
    })
    .then(async (exchange) => {
      // [makerAmount, makerPrice, makerSide, makerNonce, takerAmount, takerPrice, takerSide, takerNonce, feeTaker, feeMaker]
      // const orderValues = [
      //   10000000000000000000, 10000000000, 0, 2636177730245614,
      //   10000000000000000000, 11000000000, 1, 4994928572541557,
      //   10000,
      //   10000
      // ]
      // // [makerAddress, takerAddress, baseTokenAddress, quoteTokenAddress]
      // const orderAddresses = [
      //   '0x6e6BB166F420DDd682cAEbf55dAfBaFda74f2c9c',
      //   '0x28074f8D0fD78629CD59290Cac185611a8d60109',
      //   '0x620C38566BAD7a895cce707F42DCd5eaC1f94861',
      //   '0x53DDd545882dec853226dC8255268C7760276695'
      // ]
      // const amount = 10000000000000000000
      // const pricepointMultiplier = 1000000
      // const result = await exchange.executeTrade(orderValues, orderAddresses, amount, pricepointMultiplier)
      // console.log(result)
      // return result
      let web3 = new Web3('http://localhost:8545')
      const privateKeyOfTrader1 = '0x3411b45169aa5a8312e51357db68621031020dcf46011d7431db1bbb6d3922ce'
      const privateKeyOfTrader2 = '0x75c3e3150c0127af37e7e9df51430d36faa4c4660b6984c1edff254486d834e9'
      const trader1 = '0x6e6BB166F420DDd682cAEbf55dAfBaFda74f2c9c'
      const trader2 = '0x28074f8D0fD78629CD59290Cac185611a8d60109'
      const feeAccount = '0x59B8515E7fF389df6926Cd52a086B0f1f46C630A'

      await exchange.setFeeAccount(feeAccount)
      await exchange.setOperator(trader1, true, { from: trader1 })

      const weth = await WETH.deployed()
      const token1 = await AE.deployed()
      const token2 = await AION.deployed()
      const tokenAmount = 10000000000000000000
      await weth.approve(exchange.address, tokenAmount, { from: trader2 })
      await token1.approve(exchange.address, tokenAmount, { from: trader2 })        

      let makerOrder = {
        userAddress: trader2,
        baseToken: token1.address,
        quoteToken: weth.address,
        amount: 1e17,
        pricepoint: 1e8,
        side: 1, // SELL
        salt: 1,
        feeMake: 5e16,
        feeTake: 5e16
      }
    
      let takerOrder = {
        userAddress: trader1,
        baseToken: token1.address,
        quoteToken: weth.address,
        amount: 1e17,
        pricepoint: 1e8,
        side: 0, // BUY,
        salt: 1,
        feeMake: 5e16,
        feeTake: 5e16
      }
    
      let makerOrderHash = getOrderHash(exchange, makerOrder)
      let takerOrderHash = getOrderHash(exchange, takerOrder)
      let { message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1 } = web3.eth.accounts.sign(makerOrderHash, privateKeyOfTrader2)
      let { message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2 } = web3.eth.accounts.sign(takerOrderHash, privateKeyOfTrader1)
    
      let orderValues = getMatchOrderValues(makerOrder, takerOrder)
      let orderAddresses = getMatchOrderAddresses(makerOrder, takerOrder)
    
      let tx = await exchange.executeSingleTrade(orderValues, orderAddresses, 1e17, [v1, v2], [r1, s1, r2, s2])
    
      let balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth)
      let takerOrderFill = await exchange.filled.call(takerOrderHash)
      let makerOrderFill = await exchange.filled.call(makerOrderHash)
      
      console.log('makerOrderFill', makerOrderFill, makerOrder)        
      console.log('takerOrderFill', takerOrderFill, takerOrder)
      console.log(balances) 
      //balances.trader1BalanceOfToken1.should.be.bignumber.equal(1e17)
      // balances.feeAccountBalanceOfWETH.should.be.bignumber.equal(1e17) // receives both maker and taker fee (5e16 + 5e16 = 1e17)
      // balances.trader2BalanceOfWETH.should.be.bignumber.equal(1e19 - 5e16)
    
      
    })
}