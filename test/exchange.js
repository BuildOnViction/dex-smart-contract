/* global  artifacts:true, web3: true, contract: true */
import chai from 'chai'
import Web3 from 'web3'
import bnChai from 'bn-chai'
import { ether, wrappedEther } from './constants'

import { utils } from 'ethers'

import { expectRevert } from './helpers'
import {
    getCancelOrderAddresses,
    getCancelOrderValues,
    getOrderHash,
    getTradeHash,
    getMatchOrderAddresses,
    getMatchOrderValues
} from './utils/exchange'
import { getBalances } from './utils/balances'

chai
    .use(require('chai-bignumber')(web3.BigNumber))
    .use(bnChai(require('bn.js')))
    .should()

const WETH = artifacts.require('./utils/WETH9.sol')
const Exchange = artifacts.require('./Exchange.sol')
const BNB = artifacts.require('./contracts/tokens/BNB.sol')
const OMG = artifacts.require('./contracts/tokens/OMG.sol')
const TUSD = artifacts.require('./tokens/TUSD.sol')
const DAI = artifacts.require('./tokens/DAI.sol')
const etherPoints = web3.fromWei('10000')

contract('Exchange', (accounts) => {
  let web3 = new Web3('http://localhost:8545')

  let owner = accounts[0]
  let feeAccount = accounts[1]
  let operator = accounts[2]
  let trader1 = accounts[3]
  let trader2 = accounts[4]
  let anyUser = accounts[5]

  let privateKeyOfTrader1 = '0x3411b45169aa5a8312e51357db68621031020dcf46011d7431db1bbb6d3922ce'
  let privateKeyOfTrader2 = '0x75c3e3150c0127af37e7e9df51430d36faa4c4660b6984c1edff254486d834e9'

  let exchange
  let weth, bnb, tusd, dai
  let token1
  let token2

  let initialBalances

  describe('Initialisation', async () => {
    beforeEach(async () => {
      weth = await WETH.new()
      exchange = await Exchange.new(weth.address, feeAccount)
    })

    it('should initialise owner correctly', async () => {
      let initializedOwner = await exchange.owner.call()
      initializedOwner.should.be.equal(owner)
    })

    it('should initialise fee account correctly', async () => {
      let initializedFeeAccount = await exchange.feeAccount.call()
      initializedFeeAccount.should.be.equal(feeAccount)
    })

    it('should initialise WETH token contract correctly', async () => {
      let initializedWethTokenContract = await exchange.wethToken.call()
      initializedWethTokenContract.should.be.equal(weth.address)
    })
  })

  describe('WETH token management', async () => {
    beforeEach(async () => {
      weth = await WETH.new()
      exchange = await Exchange.new(weth.address, feeAccount)
    })

    it('should set WETH token address if requested by owner', async () => {
      let expectedWethTokenAddress = accounts[6]
      await exchange.setWethToken(expectedWethTokenAddress, { from: owner })

      let wethTokenContractAddress = await exchange.wethToken.call()
      wethTokenContractAddress.should.be.equal(expectedWethTokenAddress)
    })

    it('should not set WETH token address if not requested by owner', async () => {
      await exchange.setOperator(operator, true, { from: owner })
      let newWethTokenAddress = accounts[6]
      await expectRevert(exchange.setWethToken(newWethTokenAddress, { from: operator }))
      await expectRevert(exchange.setWethToken(newWethTokenAddress, { from: anyUser }))
    })
  })

  describe('Operator management', async () => {
    beforeEach(async () => {
      weth = await WETH.new()
      exchange = await Exchange.new(weth.address, feeAccount)
    })

    it('should set operator if requested by owner', async () => {
      let expectedOperator = accounts[2]
      await exchange.setOperator(expectedOperator, true, { from: owner })

      let isOperator = await exchange.operators.call(expectedOperator)
      isOperator.should.be.equal(true)

      await exchange.setOperator(expectedOperator, false, { from: owner })

      isOperator = await exchange.operators.call(expectedOperator)
      isOperator.should.be.equal(false)
    })

    it('should not set operator if not requested by owner', async () => {
      await exchange.setOperator(operator, true, { from: owner })

      let newOperator = accounts[7]
      await expectRevert(exchange.setOperator(newOperator, true, { from: operator }))
      await expectRevert(exchange.setOperator(newOperator, true, { from: anyUser }))
    })

    it('should not set zero address as operator', async () => {
      let newOperator = '0x0000000000000000000000000000000000000000'
      await expectRevert(exchange.setOperator(newOperator, true, { from: owner }))
    })
  })

  describe('Fee account management', async () => {
    beforeEach(async () => {
      weth = await WETH.new()
      exchange = await Exchange.new(weth.address, feeAccount)

      await exchange.setOperator(operator, true, { from: owner })
    })

    it('should set fee account if requested by owner', async () => {
      let expectedNewFeeAccount = accounts[3]
      await exchange.setFeeAccount(expectedNewFeeAccount, { from: owner })

      let newFeeAccount = await exchange.feeAccount.call()
      newFeeAccount.should.be.equal(expectedNewFeeAccount)
    })

    it('should not set fee account if not requested by owner or operator', async () => {
      let expectedNewFeeAccount = accounts[3]
      await expectRevert(exchange.setFeeAccount(expectedNewFeeAccount, { from: operator }))
      await expectRevert(exchange.setFeeAccount(expectedNewFeeAccount, { from: anyUser }))
    })

    it('should not set zero address as fee account', async () => {
      let newFeeAccount = '0x0000000000000000000000000000000000000000'
      await expectRevert(exchange.setFeeAccount(newFeeAccount, { from: owner }))
    })
  })

  describe('Pair management', async () => {
    beforeEach(async() => {
      let mintedTokens = 10000000000e18

      weth = await WETH.new()
      exchange = await Exchange.new(weth.address, feeAccount)
      bnb = await BNB.new(owner, mintedTokens)
      tusd = await TUSD.new(owner, mintedTokens)
      dai = await DAI.new(owner, mintedTokens)
    })

    it.only('should register pair correctly', async () => {
      await exchange.registerPair(bnb.address, tusd.address, 1e9)

      let isRegistered = await exchange.pairIsRegistered(bnb.address, tusd.address)
      isRegistered.should.be.equal(true)
    })

    it.only('should return correcly pair pricepointMultiplier', async () => {
      await exchange.registerPair(bnb.address, tusd.address, 1e9)

      let pricepointMultiplier = await exchange.getPairPricepointMultiplier(bnb.address, tusd.address)
      pricepointMultiplier.should.be.bignumber.equal(1e9)
    })
  })

  describe('Trading', async () => {
    describe('', async () => {
      beforeEach(async () => {
        let tokenAmount = web3.utils.toWei('10000', 'ether')

        weth = await WETH.new()
        token1 = await BNB.new(trader2, tokenAmount)
        token2 = await OMG.new(trader2, tokenAmount)

        exchange = await Exchange.new(weth.address, feeAccount)
        await exchange.setOperator(operator, true, { from: owner })

        await weth.deposit({ from: trader1, value: tokenAmount })
        await weth.approve(exchange.address, tokenAmount, { from: trader1 })
        await weth.approve(exchange.address, tokenAmount, { from: trader2 })
        await token1.approve(exchange.address, tokenAmount, { from: trader2 })

        initialBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth)
        await exchange.registerPair(token1.address, weth.address, 1e6)
      })

      it('should execute trade', async () => {
        let makerOrder = {
          userAddress: trader1,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8,
          side: 0, // BUY,
          salt: 1,
          feeMake: 0,
          feeTake: 0
        }

        let takerOrder = {
          userAddress: trader2,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8,
          side: 1,
          salt: 1,
          feeMake: 0,
          feeTake: 0
        }

        let makerOrderHash = getOrderHash(exchange, makerOrder)
        let takerOrderHash = getOrderHash(exchange, takerOrder)
        let { message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1 } = web3.eth.accounts.sign(makerOrderHash, privateKeyOfTrader1)
        let { message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2 } = web3.eth.accounts.sign(takerOrderHash, privateKeyOfTrader2)

        let orderValues = getMatchOrderValues(makerOrder, takerOrder)
        let orderAddresses = getMatchOrderAddresses(makerOrder, takerOrder)

        let tx = await exchange.executeSingleTrade(orderValues, orderAddresses, 1e17, [v1, v2], [r1, s1, r2, s2])

        let balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth)
        let takerOrderFill = await exchange.filled.call(takerOrderHash)
        let makerOrderFill = await exchange.filled.call(makerOrderHash)

        makerOrderFill.should.be.bignumber.equal(makerOrder.amount)
        takerOrderFill.should.be.bignumber.equal(takerOrder.amount)
        balances.trader1BalanceOfToken1.should.be.bignumber.equal(1e17)
        balances.trader2BalanceOfWETH.should.be.bignumber.equal(1e19)
      })

      it('should execute two identical orders with a different nonce', async () => {
        let makerOrder1 = {
          userAddress: trader1,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8,
          side: 0, // BUY,
          salt: 1,
          feeMake: 0,
          feeTake: 0
        }

        let makerOrder2 = {
          userAddress: trader1,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8,
          side: 0, // BUY,
          salt: 2,
          feeMake: 0,
          feeTake: 0
        }

        let takerOrder = {
          userAddress: trader2,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 2e17,
          pricepoint: 1e8,
          side: 1,
          salt: 1,
          feeMake: 0,
          feeTake: 0
        }

        let makerOrderHash1 = getOrderHash(exchange, makerOrder1)
        let makerOrderHash2 = getOrderHash(exchange, makerOrder2)
        let takerOrderHash = getOrderHash(exchange, takerOrder)

        let { message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1 } = web3.eth.accounts.sign(makerOrderHash1, privateKeyOfTrader1)
        let { message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2 } = web3.eth.accounts.sign(makerOrderHash2, privateKeyOfTrader1)
        let { message: message3, messageHash: messageHash3, r: r3, s: s3, v: v3 } = web3.eth.accounts.sign(takerOrderHash, privateKeyOfTrader2)

        let orderValues1 = getMatchOrderValues(makerOrder1, takerOrder)
        let orderAddresses1 = getMatchOrderAddresses(makerOrder1, takerOrder)

        let orderValues2 = getMatchOrderValues(makerOrder2, takerOrder)
        let orderAddresses2 = getMatchOrderAddresses(makerOrder2, takerOrder)

        let tx = await exchange.executeSingleTrade(orderValues1, orderAddresses1, 1e17, [v1, v3], [r1, s1, r3, s3])

        let balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth)
        let makerOrderFill1 = await exchange.filled.call(makerOrderHash1)
        let makerOrderFill2 = await exchange.filled.call(makerOrderHash2)
        let takerOrderFill = await exchange.filled.call(takerOrderHash)
        makerOrderFill1.should.be.bignumber.equal(1e17)
        makerOrderFill2.should.be.bignumber.equal(0)
        takerOrderFill.should.be.bignumber.equal(1e17)
        balances.trader1BalanceOfToken1.should.be.bignumber.equal(1e17)
        balances.trader2BalanceOfWETH.should.be.bignumber.equal(1e19)

        tx = await exchange.executeSingleTrade(orderValues2, orderAddresses2, 1e17, [v2, v3], [r2, s2, r3, s3])

        balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth)
        makerOrderFill1 = await exchange.filled.call(makerOrderHash1)
        makerOrderFill2 = await exchange.filled.call(makerOrderHash2)
        takerOrderFill = await exchange.filled.call(takerOrderHash)
        makerOrderFill1.should.be.bignumber.equal(1e17)
        makerOrderFill2.should.be.bignumber.equal(1e17)
        takerOrderFill.should.be.bignumber.equal(2e17)
        balances.trader1BalanceOfToken1.should.be.bignumber.equal(2e17)
        balances.trader2BalanceOfWETH.should.be.bignumber.equal(2e19)
      })

      it('should not execute two identical orders with the same nonce', async () => {
        let makerOrder1 = {
          userAddress: trader1,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8,
          side: 0, // BUY,
          salt: 1,
          feeMake: 0,
          feeTake: 0
        }

        let makerOrder2 = {
          userAddress: trader1,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8,
          side: 0, // BUY,
          salt: 1,
          feeMake: 0,
          feeTake: 0
        }

        let takerOrder = {
          userAddress: trader2,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 2e17,
          pricepoint: 1e8,
          side: 1,
          salt: 1,
          feeMake: 0,
          feeTake: 0
        }

        let makerOrderHash1 = getOrderHash(exchange, makerOrder1)
        let makerOrderHash2 = getOrderHash(exchange, makerOrder2)
        let takerOrderHash = getOrderHash(exchange, takerOrder)

        let { message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1 } = web3.eth.accounts.sign(makerOrderHash1, privateKeyOfTrader1)
        let { message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2 } = web3.eth.accounts.sign(makerOrderHash2, privateKeyOfTrader1)
        let { message: message3, messageHash: messageHash3, r: r3, s: s3, v: v3 } = web3.eth.accounts.sign(takerOrderHash, privateKeyOfTrader2)

        let orderValues1 = getMatchOrderValues(makerOrder1, takerOrder)
        let orderAddresses1 = getMatchOrderAddresses(makerOrder1, takerOrder)

        let orderValues2 = getMatchOrderValues(makerOrder2, takerOrder)
        let orderAddresses2 = getMatchOrderAddresses(makerOrder2, takerOrder)

        let tx = await exchange.executeSingleTrade(orderValues1, orderAddresses1, 1e17, [v1, v3], [r1, s1, r3, s3])

        let balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth)
        let makerOrderFill1 = await exchange.filled.call(makerOrderHash1)
        let makerOrderFill2 = await exchange.filled.call(makerOrderHash2)
        let takerOrderFill = await exchange.filled.call(takerOrderHash)
        makerOrderFill1.should.be.bignumber.equal(1e17)
        makerOrderFill2.should.be.bignumber.equal(1e17) // identical to makerOrderFill2 because it is the same hash
        takerOrderFill.should.be.bignumber.equal(1e17)
        balances.trader1BalanceOfToken1.should.be.bignumber.equal(1e17)
        balances.trader2BalanceOfWETH.should.be.bignumber.equal(1e19)

        tx = await exchange.executeSingleTrade(orderValues2, orderAddresses2, 1e17, [v2, v3], [r2, s2, r3, s3])

        balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth)
        makerOrderFill1 = await exchange.filled.call(makerOrderHash1)
        makerOrderFill2 = await exchange.filled.call(makerOrderHash2)
        takerOrderFill = await exchange.filled.call(takerOrderHash)
        makerOrderFill1.should.be.bignumber.equal(1e17)
        makerOrderFill2.should.be.bignumber.equal(1e17) // identical to makerOrderFill2 because it is the same hash
        takerOrderFill.should.be.bignumber.equal(1e17)
        balances.trader1BalanceOfToken1.should.be.bignumber.equal(1e17)
        balances.trader2BalanceOfWETH.should.be.bignumber.equal(1e19)
      })

      it('should not execute trade if the sell pricepoint is above the buy pricepoint', async () => {
        let makerOrder = {
          userAddress: trader1,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8 - 1,
          side: 0, // BUY,
          salt: 1,
          feeMake: 0,
          feeTake: 0
        }

        let takerOrder = {
          userAddress: trader2,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8 + 1,
          side: 1,
          salt: 1,
          feeMake: 0,
          feeTake: 0
        }

        let makerOrderHash = getOrderHash(exchange, makerOrder)
        let takerOrderHash = getOrderHash(exchange, takerOrder)
        let { message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1 } = web3.eth.accounts.sign(makerOrderHash, privateKeyOfTrader1)
        let { message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2 } = web3.eth.accounts.sign(takerOrderHash, privateKeyOfTrader2)

        let orderValues = getMatchOrderValues(makerOrder, takerOrder)
        let orderAddresses = getMatchOrderAddresses(makerOrder, takerOrder)

        let tx = await exchange.executeSingleTrade(orderValues, orderAddresses, 1e17, [v1, v2], [r1, s1, r2, s2])

        let balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth)
        let takerOrderFill = await exchange.filled.call(takerOrderHash)
        let makerOrderFill = await exchange.filled.call(makerOrderHash)

        makerOrderFill.should.be.bignumber.equal(0)
        takerOrderFill.should.be.bignumber.equal(0)
        balances.trader1BalanceOfToken1.should.be.bignumber.equal(0)
        balances.trader2BalanceOfWETH.should.be.bignumber.equal(0)
      })

      it('should not execute trade if both orders have the same side', async () => {
        let makerOrder = {
          userAddress: trader1,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8,
          side: 0, // BUY,
          salt: 1,
          feeMake: 0,
          feeTake: 0
        }

        let takerOrder = {
          userAddress: trader2,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8,
          side: 0,
          salt: 1,
          feeMake: 0,
          feeTake: 0
        }

        let makerOrderHash = getOrderHash(exchange, makerOrder)
        let takerOrderHash = getOrderHash(exchange, takerOrder)
        let { message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1 } = web3.eth.accounts.sign(makerOrderHash, privateKeyOfTrader1)
        let { message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2 } = web3.eth.accounts.sign(takerOrderHash, privateKeyOfTrader2)

        let orderValues = getMatchOrderValues(makerOrder, takerOrder)
        let orderAddresses = getMatchOrderAddresses(makerOrder, takerOrder)

        let tx = await exchange.executeSingleTrade(orderValues, orderAddresses, 1e17, [v1, v2], [r1, s1, r2, s2])

        let balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth)
        let takerOrderFill = await exchange.filled.call(takerOrderHash)
        let makerOrderFill = await exchange.filled.call(makerOrderHash)

        makerOrderFill.should.be.bignumber.equal(0)
        takerOrderFill.should.be.bignumber.equal(0)
        balances.trader1BalanceOfToken1.should.be.bignumber.equal(0)
        balances.trader2BalanceOfWETH.should.be.bignumber.equal(0)
      })

      it('should not execute trade if the signature is invalid', async () => {
        let makerOrder = {
          userAddress: trader1,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8,
          side: 0, // BUY,
          salt: 1,
          feeMake: 0,
          feeTake: 0
        }

        let takerOrder = {
          userAddress: trader2,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8,
          side: 1,
          salt: 1,
          feeMake: 0,
          feeTake: 0
        }

        let makerOrderHash = getOrderHash(exchange, makerOrder)
        let takerOrderHash = getOrderHash(exchange, takerOrder)

              // both messages are signed with the same private keys
        let { message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1 } = web3.eth.accounts.sign(makerOrderHash, privateKeyOfTrader1)
        let { message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2 } = web3.eth.accounts.sign(takerOrderHash, privateKeyOfTrader1)

        let orderValues = getMatchOrderValues(makerOrder, takerOrder)
        let orderAddresses = getMatchOrderAddresses(makerOrder, takerOrder)

        let tx = await exchange.executeSingleTrade(orderValues, orderAddresses, 1e17, [v1, v2], [r1, s1, r2, s2])

        let balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth)
        let takerOrderFill = await exchange.filled.call(takerOrderHash)
        let makerOrderFill = await exchange.filled.call(makerOrderHash)

        makerOrderFill.should.be.bignumber.equal(0)
        takerOrderFill.should.be.bignumber.equal(0)
        balances.trader1BalanceOfToken1.should.be.bignumber.equal(0)
        balances.trader2BalanceOfWETH.should.be.bignumber.equal(0)
      })

      it('should not execute the same order twice', async () => {
        let makerOrder = {
          userAddress: trader1,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8,
          side: 0, // BUY,
          salt: 1,
          feeMake: 0,
          feeTake: 0
        }

        let takerOrder1 = {
          userAddress: trader2,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8,
          side: 1,
          salt: 1,
          feeMake: 0,
          feeTake: 0
        }

        let takerOrder2 = {
          userAddress: trader2,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8,
          side: 1,
          salt: 2,
          feeMake: 0,
          feeTake: 0
        }

        let makerOrderHash = getOrderHash(exchange, makerOrder)
        let takerOrderHash1 = getOrderHash(exchange, takerOrder1)
        let takerOrderHash2 = getOrderHash(exchange, takerOrder2)

              // both messages are signed with the same private keys
        let { message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1 } = web3.eth.accounts.sign(makerOrderHash, privateKeyOfTrader1)
        let { message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2 } = web3.eth.accounts.sign(takerOrderHash1, privateKeyOfTrader2)
        let { message: message3, messageHash: messageHash3, r: r3, s: s3, v: v3 } = web3.eth.accounts.sign(takerOrderHash2, privateKeyOfTrader2)

        let orderValues1 = getMatchOrderValues(makerOrder, takerOrder1)
        let orderAddresses1 = getMatchOrderAddresses(makerOrder, takerOrder1)

        let orderValues2 = getMatchOrderValues(makerOrder, takerOrder2)
        let orderAddresses2 = getMatchOrderAddresses(makerOrder, takerOrder2)

        let tx1 = await exchange.executeSingleTrade(orderValues1, orderAddresses1, 1e17, [v1, v2], [r1, s1, r2, s2])
        let balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth)
        let makerOrderFill = await exchange.filled.call(makerOrderHash)
        let takerOrderFill1 = await exchange.filled.call(takerOrderHash1)
        makerOrderFill.should.be.bignumber.equal(makerOrder.amount)
        takerOrderFill1.should.be.bignumber.equal(takerOrder1.amount)
        balances.trader1BalanceOfToken1.should.be.bignumber.equal(1e17)
        balances.trader2BalanceOfWETH.should.be.bignumber.equal(1e19)

        let tx2 = await exchange.executeSingleTrade(orderValues2, orderAddresses2, 1e17, [v1, v3], [r1, s1, r3, s3])
        balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth)
        makerOrderFill = await exchange.filled.call(makerOrderHash)
        takerOrderFill1 = await exchange.filled.call(takerOrderHash1)
        let takerOrderFill2 = await exchange.filled.call(takerOrderHash2)
        makerOrderFill.should.be.bignumber.equal(makerOrder.amount)
        takerOrderFill1.should.be.bignumber.equal(takerOrder1.amount)
        takerOrderFill2.should.be.bignumber.equal(0)
        balances.trader1BalanceOfToken1.should.be.bignumber.equal(1e17)
        balances.trader2BalanceOfWETH.should.be.bignumber.equal(1e19)
      })

      it('should execute trade with fee (maker buys, taker sells)', async () => {
        let makerOrder = {
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

        let takerOrder = {
          userAddress: trader2,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8,
          side: 1,
          salt: 1,
          feeMake: 5e16,
          feeTake: 5e16
        }

        let makerOrderHash = getOrderHash(exchange, makerOrder)
        let takerOrderHash = getOrderHash(exchange, takerOrder)
        let { message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1 } = web3.eth.accounts.sign(makerOrderHash, privateKeyOfTrader1)
        let { message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2 } = web3.eth.accounts.sign(takerOrderHash, privateKeyOfTrader2)

        let orderValues = getMatchOrderValues(makerOrder, takerOrder)
        let orderAddresses = getMatchOrderAddresses(makerOrder, takerOrder)

        let tx = await exchange.executeSingleTrade(orderValues, orderAddresses, 1e17, [v1, v2], [r1, s1, r2, s2])

        let balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth)
        let takerOrderFill = await exchange.filled.call(takerOrderHash)
        let makerOrderFill = await exchange.filled.call(makerOrderHash)

        makerOrderFill.should.be.bignumber.equal(makerOrder.amount)
        takerOrderFill.should.be.bignumber.equal(takerOrder.amount)
        balances.trader1BalanceOfToken1.should.be.bignumber.equal(1e17)
        balances.feeAccountBalanceOfWETH.should.be.bignumber.equal(1e17) // receives both maker and taker fee (5e16 + 5e16 = 1e17)
        balances.trader2BalanceOfWETH.should.be.bignumber.equal(995e16)
      })

      it('should execute trade with fee (maker sells, taker buys)', async () => {
        let makerOrder = {
          userAddress: trader2,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8,
          side: 1,
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

        makerOrderFill.should.be.bignumber.equal(makerOrder.amount)
        takerOrderFill.should.be.bignumber.equal(takerOrder.amount)
        balances.trader1BalanceOfToken1.should.be.bignumber.equal(1e17)
        balances.feeAccountBalanceOfWETH.should.be.bignumber.equal(1e17) // receives both maker and taker fee (5e16 + 5e16 = 1e17)
        balances.trader2BalanceOfWETH.should.be.bignumber.equal(1e19 - 5e16)
      })

      it('should pay fee proportionally to the order amount (maker sells, taker buys)', async () => {
        let makerOrder1 = {
          userAddress: trader2,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 1e17,
          pricepoint: 1e8,
          side: 1,
          salt: 1,
          feeMake: 5e16,
          feeTake: 5e16
        }

        let takerOrder1 = {
          userAddress: trader1,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 5e16,
          pricepoint: 1e8,
          side: 0, // BUY,
          salt: 1,
          feeMake: 5e16,
          feeTake: 5e16
        }

        let takerOrder2 = {
          userAddress: trader1,
          baseToken: token1.address,
          quoteToken: weth.address,
          amount: 5e16,
          pricepoint: 1e8,
          side: 0, // BUY,
          salt: 2,
          feeMake: 5e16,
          feeTake: 5e16
        }

        let makerOrderHash1 = getOrderHash(exchange, makerOrder1)
        let takerOrderHash1 = getOrderHash(exchange, takerOrder1)
        let takerOrderHash2 = getOrderHash(exchange, takerOrder2)
        let { message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1 } = web3.eth.accounts.sign(makerOrderHash1, privateKeyOfTrader2)
        let { message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2 } = web3.eth.accounts.sign(takerOrderHash1, privateKeyOfTrader1)
        let { message: message3, messageHash: messageHash3, r: r3, s: s3, v: v3 } = web3.eth.accounts.sign(takerOrderHash2, privateKeyOfTrader1)

        let orderValues1 = getMatchOrderValues(makerOrder1, takerOrder1)
        let orderValues2 = getMatchOrderValues(makerOrder1, takerOrder2)
        let orderAddresses1 = getMatchOrderAddresses(makerOrder1, takerOrder1)
        let orderAddresses2 = getMatchOrderAddresses(makerOrder1, takerOrder2)

        let tx1 = await exchange.executeSingleTrade(orderValues1, orderAddresses1, 5e16, [v1, v2], [r1, s1, r2, s2])
        let tx2 = await exchange.executeSingleTrade(orderValues2, orderAddresses2, 5e16, [v1, v2], [r1, s1, r3, s3])

        let balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth)
        let makerOrderFill1 = await exchange.filled.call(makerOrderHash1)
        let takerOrderFill1 = await exchange.filled.call(takerOrderHash1)
        let takerOrderFill2 = await exchange.filled.call(takerOrderHash2)

        makerOrderFill1.should.be.bignumber.equal(makerOrder1.amount)
        takerOrderFill1.should.be.bignumber.equal(takerOrder1.amount)
        takerOrderFill2.should.be.bignumber.equal(takerOrder2.amount)

        balances.trader1BalanceOfToken1.should.be.bignumber.equal(1e17)
        balances.feeAccountBalanceOfWETH.should.be.bignumber.equal(15e16) // receive 2 takeFees from the takerOrders and one from the makerOrder
        balances.trader2BalanceOfWETH.should.be.bignumber.equal(1e19 - 5e16)
      })
    })
  })
})

        //     it('should execute if trade.amount < order.amountBuy (Token against Token)', async () => {
        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 1000,
        //             amountSell: 1000,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 500,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValues = getMatchOrderValues(order, trade);
        //         let orderAddresses = getMatchOrderAddresses(order, trade);

        //         await exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]);

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(trade.amount);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(true);

        //         let balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         balances.trader1BalanceOfToken1.should.be.bignumber.equal(500);
        //         balances.trader1BalanceOfToken2.should.be.bignumber.equal(500);
        //         balances.trader1BalanceOfWETH.should.be.bignumber.equal(9.5e17);
        //         balances.trader2BalanceOfToken1.should.be.bignumber.equal(500);
        //         balances.trader2BalanceOfToken2.should.be.bignumber.equal(500);
        //         balances.trader2BalanceOfWETH.should.be.bignumber.equal(9.5e17);
        //         balances.feeAccountBalanceOfWETH.should.be.bignumber.equal(1e17)
        //     });

        //     it('should execute if trade.amount = order.amountBuy (Token against Token)', async () => {
        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 1000,
        //             amountSell: 1000,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 1000,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValues = getMatchOrderValues(order, trade);
        //         let orderAddresses = getMatchOrderAddresses(order, trade);

        //         await exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]);

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(trade.amount);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(true);

        //         let balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         balances.trader1BalanceOfToken1.should.be.bignumber.equal(0);
        //         balances.trader1BalanceOfToken2.should.be.bignumber.equal(1000);
        //         balances.trader1BalanceOfWETH.should.be.bignumber.equal(9e17);
        //         balances.trader2BalanceOfToken1.should.be.bignumber.equal(1000);
        //         balances.trader2BalanceOfToken2.should.be.bignumber.equal(0);
        //         balances.trader2BalanceOfWETH.should.be.bignumber.equal(9e17);
        //         balances.feeAccountBalanceOfWETH.should.be.bignumber.equal(2e17)
        //     });

        //     it('should not execute if trade.amount > order.amountBuy (Token against Token)', async () => {
        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 500,
        //             amountSell: 500,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 600,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValues = getMatchOrderValues(order, trade);
        //         let orderAddresses = getMatchOrderAddresses(order, trade);

        //         let tradeExecutionResult = await exchange.executeTrade.call(
        //             orderValues,
        //             orderAddresses,
        //             [v1, v2],
        //             [r1, s1, r2, s2]
        //         );

        //         tradeExecutionResult.should.be.equal(false);

        //         await exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]);

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(0);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(false);

        //         let currentBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         currentBalances.should.be.deep.equals(initialBalances);

        //     });

        //     it('should execute if trade.amount < order.amountBuy (Token against WETH)', async () => {
        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 5e17,
        //             amountSell: 1000,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: weth.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 2.5e17,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValues = getMatchOrderValues(order, trade);
        //         let orderAddresses = getMatchOrderAddresses(order, trade);

        //         await exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]);

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(trade.amount);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(true);

        //         let balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         balances.trader1BalanceOfToken1.should.be.bignumber.equal(500);
        //         balances.trader1BalanceOfWETH.should.be.bignumber.equal(1.20e18);
        //         balances.trader2BalanceOfToken1.should.be.bignumber.equal(500);
        //         balances.trader2BalanceOfWETH.should.be.bignumber.equal(7E17);
        //         balances.feeAccountBalanceOfWETH.should.be.bignumber.equal(1e17)
        //     });

        //     it('should execute if trade.amount = order.amountBuy (Token against WETH)', async () => {
        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 5e17,
        //             amountSell: 1000,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: weth.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 5e17,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValues = getMatchOrderValues(order, trade);
        //         let orderAddresses = getMatchOrderAddresses(order, trade);

        //         await exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]);

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(trade.amount);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(true);

        //         let balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         balances.trader1BalanceOfToken1.should.be.bignumber.equal(0);
        //         balances.trader1BalanceOfWETH.should.be.bignumber.equal(1.4e18);
        //         balances.trader2BalanceOfToken1.should.be.bignumber.equal(1000);
        //         balances.trader2BalanceOfWETH.should.be.bignumber.equal(4E17);
        //         balances.feeAccountBalanceOfWETH.should.be.bignumber.equal(2e17)
        //     });

        //     it('should not execute if trade.amount > order.amountBuy (Token against WETH)', async () => {
        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 5e17,
        //             amountSell: 1000,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: weth.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 6e17,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValues = getMatchOrderValues(order, trade);
        //         let orderAddresses = getMatchOrderAddresses(order, trade);

        //         let tradeExecutionResult = await exchange.executeTrade.call(
        //             orderValues,
        //             orderAddresses,
        //             [v1, v2],
        //             [r1, s1, r2, s2]
        //         );

        //         tradeExecutionResult.should.be.equal(false);

        //         await exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]);

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(0);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(false);

        //         let currentBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         currentBalances.should.be.deep.equals(initialBalances);
        //     });

        //     it('should not execute if maker signature is invalid', async () => {
        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 1000,
        //             amountSell: 1000,
        //             expires: initialBlockNumber - 1,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 1000,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader2);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValues = getMatchOrderValues(order, trade);
        //         let orderAddresses = getMatchOrderAddresses(order, trade);

        //         let tradeExecutionResult = await exchange.executeTrade.call(
        //             orderValues,
        //             orderAddresses,
        //             [v1, v2],
        //             [r1, s1, r2, s2]
        //         );

        //         tradeExecutionResult.should.be.equal(false);

        //         await exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]);

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(0);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(false);

        //         let currentBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         currentBalances.should.be.deep.equals(initialBalances);
        //     });

        //     it('should not execute if taker signature is invalid', async () => {
        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 1000,
        //             amountSell: 1000,
        //             expires: initialBlockNumber - 1,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 1000,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader1);

        //         let orderValues = getMatchOrderValues(order, trade);
        //         let orderAddresses = getMatchOrderAddresses(order, trade);

        //         let tradeExecutionResult = await exchange.executeTrade.call(
        //             orderValues,
        //             orderAddresses,
        //             [v1, v2],
        //             [r1, s1, r2, s2]
        //         );

        //         tradeExecutionResult.should.be.equal(false);

        //         await exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]);

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(0);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(false);

        //         let currentBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         currentBalances.should.be.deep.equals(initialBalances);
        //     });

        //     it('should not execute if order has expired', async () => {
        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 1000,
        //             amountSell: 1000,
        //             expires: initialBlockNumber - 1,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 1000,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValues = getMatchOrderValues(order, trade);
        //         let orderAddresses = getMatchOrderAddresses(order, trade);

        //         let tradeExecutionResult = await exchange.executeTrade.call(
        //             orderValues,
        //             orderAddresses,
        //             [v1, v2],
        //             [r1, s1, r2, s2]
        //         );

        //         tradeExecutionResult.should.be.equal(false);

        //         await exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]);

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(0);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(false);

        //         let currentBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         currentBalances.should.be.deep.equals(initialBalances);
        //     });

        //     it('should not execute if trade is already completed', async () => {
        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 1000,
        //             amountSell: 1000,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 500,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValuesForTrade1 = getMatchOrderValues(order, trade);
        //         let orderAddressesForTrade1 = getMatchOrderAddresses(order, trade);

        //         await exchange.executeTrade(orderValuesForTrade1, orderAddressesForTrade1, [v1, v2], [r1, s1, r2, s2]);

        //         let balancesBefore = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);

        //         let tradeExecutionResult = await exchange.executeTrade.call(
        //             orderValuesForTrade1,
        //             orderAddressesForTrade1,
        //             [v1, v2],
        //             [r1, s1, r2, s2]
        //         );

        //         tradeExecutionResult.should.be.equal(false);

        //         await exchange.executeTrade(orderValuesForTrade1, orderAddressesForTrade1, [v1, v2], [r1, s1, r2, s2]);

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(trade.amount);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(true);

        //         let balancesAfter = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         balancesAfter.should.be.deep.equals(balancesBefore);
        //     });

        //     it('should not execute if trade is already cancelled', async () => {
        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 1000,
        //             amountSell: 1000,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 500,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValuesForTrade1 = getMatchOrderValues(order, trade);
        //         let orderAddressesForTrade1 = getMatchOrderAddresses(order, trade);

        //         await exchange.cancelTrade(
        //             orderHash,
        //             trade.amount,
        //             trade.tradeNonce,
        //             trade.taker,
        //             v2,
        //             r2,
        //             s2,
        //             {from: trader2});

        //         let tradeExecutionResult = await exchange.executeTrade.call(
        //             orderValuesForTrade1,
        //             orderAddressesForTrade1,
        //             [v1, v2],
        //             [r1, s1, r2, s2]
        //         );

        //         await exchange.executeTrade(orderValuesForTrade1, orderAddressesForTrade1, [v1, v2], [r1, s1, r2, s2]);

        //         tradeExecutionResult.should.be.equal(false);

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(0);

        //         let tradeCancelled = await exchange.traded.call(tradeHash);
        //         tradeCancelled.should.be.equal(true);

        //         let currentBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         currentBalances.should.be.deep.equals(initialBalances);
        //     });

        //     it('should not execute if rounding error too large', async () => {
        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 3000,
        //             amountSell: 1000,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 100,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValuesForTrade1 = getMatchOrderValues(order, trade);
        //         let orderAddressesForTrade1 = getMatchOrderAddresses(order, trade);

        //         let tradeExecutionResult = await exchange.executeTrade.call(
        //             orderValuesForTrade1,
        //             orderAddressesForTrade1,
        //             [v1, v2],
        //             [r1, s1, r2, s2]
        //         );

        //         tradeExecutionResult.should.be.equal(false);

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(0);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(false);

        //         let currentBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         currentBalances.should.be.deep.equals(initialBalances);
        //     });

        //     it('should not execute if order is already completed', async () => {
        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 1000,
        //             amountSell: 1000,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade1 = {
        //             amount: 1000,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let trade1Hash = getTradeHash(orderHash, trade1);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(trade1Hash, privateKeyOfTrader2);

        //         let orderValuesForTrade1 = getMatchOrderValues(order, trade1);
        //         let orderAddressesForTrade1 = getMatchOrderAddresses(order, trade1);

        //         await exchange.executeTrade(
        //             orderValuesForTrade1,
        //             orderAddressesForTrade1,
        //             [v1, v2],
        //             [r1, s1, r2, s2]
        //         );

        //         let balancesBeforeTrade2 = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);

        //         let trade2 = {
        //             amount: 100,
        //             tradeNonce: 2,
        //             taker: trader2
        //         };

        //         let trade2Hash = getTradeHash(orderHash, trade2);

        //         let {message: message3, messageHash: messageHash3, r: r3, s: s3, v: v3} = web3.eth.accounts.sign(trade2Hash, privateKeyOfTrader2);

        //         let orderValuesForTrade2 = getMatchOrderValues(order, trade2);
        //         let orderAddressesForTrade2 = getMatchOrderAddresses(order, trade2);

        //         let tradeExecutionResult = await exchange.executeTrade.call(
        //             orderValuesForTrade2,
        //             orderAddressesForTrade2,
        //             [v1, v3],
        //             [r1, s1, r3, s3]
        //         );

        //         tradeExecutionResult.should.be.equal(false);

        //         await exchange.executeTrade(orderValuesForTrade2, orderAddressesForTrade2, [v1, v3], [r1, s1, r3, s3]);

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(order.amountBuy);

        //         let trade2Completed = await exchange.traded.call(trade2Hash);
        //         trade2Completed.should.be.equal(false);

        //         let balancesAfterTrade2 = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         balancesAfterTrade2.should.be.deep.equals(balancesBeforeTrade2);
        //     })
        // });

        // describe('', async () => {
        //     beforeEach(async () => {
        //         weth = await WETH.new();
        //         exchange = await Exchange.new(weth.address, feeAccount);
        //         token1 = await BNB.new(trader1, 1000);
        //         token2 = await OMG.new(trader2, 1000)
        //     });

        //     it('should not execute if maker does not have enough sellToken balance', async () => {
        //         await weth.deposit({from: trader1, value: ether});
        //         weth.approve(exchange.address, wrappedEther, {from: trader1});

        //         await weth.deposit({from: trader2, value: ether});
        //         weth.approve(exchange.address, wrappedEther, {from: trader2});

        //         await token1.approve(exchange.address, 1500, {from: trader1});
        //         await token2.approve(exchange.address, 1000, {from: trader2});

        //         initialBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);

        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 1000,
        //             amountSell: 1500,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 1000,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValues = getMatchOrderValues(order, trade);
        //         let orderAddresses = getMatchOrderAddresses(order, trade);

        //         await expectRevert(exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]));

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(0);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(false);

        //         let currentBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         currentBalances.should.be.deep.equals(initialBalances);
        //     });

        //     it('should not execute if exchange does not have enough sellToken allowance from maker', async () => {
        //         await weth.deposit({from: trader1, value: ether});
        //         weth.approve(exchange.address, wrappedEther, {from: trader1});

        //         await weth.deposit({from: trader2, value: ether});
        //         weth.approve(exchange.address, wrappedEther, {from: trader2});

        //         await token1.approve(exchange.address, 500, {from: trader1});
        //         await token2.approve(exchange.address, 1000, {from: trader2});

        //         initialBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);

        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 1000,
        //             amountSell: 1000,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 1000,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValues = getMatchOrderValues(order, trade);
        //         let orderAddresses = getMatchOrderAddresses(order, trade);

        //         await expectRevert(exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]));

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(0);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(false);

        //         let currentBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         currentBalances.should.be.deep.equals(initialBalances);
        //     });

        //     it('should not execute if maker does not have enough WETH to pay maker fees for trade', async () => {
        //         await weth.deposit({from: trader1, value: 5e16});
        //         weth.approve(exchange.address, wrappedEther, {from: trader1});

        //         await weth.deposit({from: trader2, value: ether});
        //         weth.approve(exchange.address, wrappedEther, {from: trader2});

        //         await token1.approve(exchange.address, 1000, {from: trader1});
        //         await token2.approve(exchange.address, 1000, {from: trader2});

        //         initialBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);

        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 1000,
        //             amountSell: 1000,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 1000,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValues = getMatchOrderValues(order, trade);
        //         let orderAddresses = getMatchOrderAddresses(order, trade);

        //         await expectRevert(exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]));

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(0);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(false);

        //         let currentBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         currentBalances.should.be.deep.equals(initialBalances);
        //     });

        //     it('should not execute if exchange does not have enough WETH allowance from maker to pay maker fee for trade', async () => {
        //         await weth.deposit({from: trader1, value: ether});
        //         weth.approve(exchange.address, 5e16, {from: trader1});

        //         await weth.deposit({from: trader2, value: ether});
        //         weth.approve(exchange.address, wrappedEther, {from: trader2});

        //         await token1.approve(exchange.address, 1000, {from: trader1});
        //         await token2.approve(exchange.address, 1000, {from: trader2});

        //         initialBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);

        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 1000,
        //             amountSell: 1000,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 1000,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValues = getMatchOrderValues(order, trade);
        //         let orderAddresses = getMatchOrderAddresses(order, trade);

        //         await expectRevert(exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]));

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(0);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(false);

        //         let currentBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         currentBalances.should.be.deep.equals(initialBalances);
        //     });

        //     it('should not execute if taker does not have enough buyToken balance', async () => {
        //         await weth.deposit({from: trader1, value: ether});
        //         weth.approve(exchange.address, wrappedEther, {from: trader1});

        //         await weth.deposit({from: trader2, value: ether});
        //         weth.approve(exchange.address, wrappedEther, {from: trader2});

        //         await token1.approve(exchange.address, 1000, {from: trader1});
        //         await token2.approve(exchange.address, 1500, {from: trader2});

        //         initialBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);

        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 1500,
        //             amountSell: 1000,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 1500,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValues = getMatchOrderValues(order, trade);
        //         let orderAddresses = getMatchOrderAddresses(order, trade);

        //         await expectRevert(exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]));

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(0);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(false);

        //         let currentBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         currentBalances.should.be.deep.equals(initialBalances);
        //     });

        //     it('should not execute if exchange does not have enough buyToken allowance from taker', async () => {
        //         await weth.deposit({from: trader1, value: ether});
        //         weth.approve(exchange.address, wrappedEther, {from: trader1});

        //         await weth.deposit({from: trader2, value: ether});
        //         weth.approve(exchange.address, wrappedEther, {from: trader2});

        //         await token1.approve(exchange.address, 1000, {from: trader1});
        //         await token2.approve(exchange.address, 500, {from: trader2});

        //         initialBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);

        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 1000,
        //             amountSell: 1000,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 1000,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValues = getMatchOrderValues(order, trade);
        //         let orderAddresses = getMatchOrderAddresses(order, trade);

        //         await expectRevert(exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]));

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(0);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(false);

        //         let currentBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         currentBalances.should.be.deep.equals(initialBalances);
        //     });

        //     it('should not execute if taker does not have enough WETH to pay taker fees for trade', async () => {
        //         await weth.deposit({from: trader1, value: ether});
        //         weth.approve(exchange.address, wrappedEther, {from: trader1});

        //         await weth.deposit({from: trader2, value: 5e16});
        //         weth.approve(exchange.address, wrappedEther, {from: trader2});

        //         await token1.approve(exchange.address, 1000, {from: trader1});
        //         await token2.approve(exchange.address, 1000, {from: trader2});

        //         initialBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);

        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 1000,
        //             amountSell: 1000,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 1000,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValues = getMatchOrderValues(order, trade);
        //         let orderAddresses = getMatchOrderAddresses(order, trade);

        //         await expectRevert(exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]));

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(0);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(false);

        //         let currentBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         currentBalances.should.be.deep.equals(initialBalances);
        //     });

        //     it('should not execute if exchange does not have enough WETH allowance from taker to pay taker fee for trade', async () => {
        //         await weth.deposit({from: trader1, value: ether});
        //         weth.approve(exchange.address, wrappedEther, {from: trader1});

        //         await weth.deposit({from: trader2, value: ether});
        //         weth.approve(exchange.address, 5e16, {from: trader2});

        //         await token1.approve(exchange.address, 1000, {from: trader1});
        //         await token2.approve(exchange.address, 1000, {from: trader2});

        //         initialBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);

        //         let initialBlockNumber = await web3.eth.getBlockNumber();

        //         let order = {
        //             amountBuy: 1000,
        //             amountSell: 1000,
        //             expires: initialBlockNumber + 10,
        //             nonce: 1,
        //             feeMake: 1e17,
        //             feeTake: 1e17,
        //             tokenBuy: token2.address,
        //             tokenSell: token1.address,
        //             maker: trader1
        //         };

        //         let trade = {
        //             amount: 1000,
        //             tradeNonce: 1,
        //             taker: trader2
        //         };

        //         let orderHash = getOrderHash(exchange, order);
        //         let tradeHash = getTradeHash(orderHash, trade);

        //         let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
        //         let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

        //         let orderValues = getMatchOrderValues(order, trade);
        //         let orderAddresses = getMatchOrderAddresses(order, trade);

        //         await expectRevert(exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]));

        //         let orderFill = await exchange.filled.call(orderHash);
        //         orderFill.should.be.bignumber.equal(0);

        //         let tradeCompleted = await exchange.traded.call(tradeHash);
        //         tradeCompleted.should.be.equal(false);

        //         let currentBalances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
        //         currentBalances.should.be.deep.equals(initialBalances);
        //     })
        // })

        // describe('Multiple trades', async () => {
          // beforeEach(async () => {
          //   weth = await WETH.new();
          //   exchange = await Exchange.new(weth.address, feeAccount);
          //   token1 = await BNB.new(trader1, 2000)
          //   token2 = await OMG.new(trader2, 1000)
          //   token2 = await OMG.new(trader3, 1000)
          // })

          // it('should execute batch trades', () => {
          //   let initialBlockNumber = await web3.eth.getBlockNumber();

          //   let order = {
          //       amountBuy: 2000,
          //       amountSell: 2000,
          //       expires: initialBlockNumber + 10,
          //       nonce: 1,
          //       feeMake: 1e17,
          //       feeTake: 1e17,
          //       tokenBuy: token2.address,
          //       tokenSell: token1.address,
          //       maker: trader1
          //   };

          //   let trade1 = {
          //       amount: 1000,
          //       tradeNonce: 1,
          //       taker: trader2
          //   };

          //   let trade2 = {
          //       amount: 1000,
          //       tradeNonce: 1,
          //       taker: trader3,
          //   }

          //   let orderHash = getOrderHash(exchange, order);
          //   let trade1Hash = getTradeHash(orderHash, trade1);
          //   let trade2Hash = getTradeHash(orderHash, )

          //   let {message: message1, messageHash: messageHash1, r: r1, s: s1, v: v1} = web3.eth.accounts.sign(orderHash, privateKeyOfTrader1);
          //   let {message: message2, messageHash: messageHash2, r: r2, s: s2, v: v2} = web3.eth.accounts.sign(tradeHash, privateKeyOfTrader2);

          //   let orderValues = getMatchOrderValues(order, trade);
          //   let orderAddresses = getMatchOrderAddresses(order, trade);

          //   await exchange.executeTrade(orderValues, orderAddresses, [v1, v2], [r1, s1, r2, s2]);

          //   let orderFill = await exchange.filled.call(orderHash);
          //   orderFill.should.be.bignumber.equal(trade.amount);

          //   let tradeCompleted = await exchange.traded.call(tradeHash);
          //   tradeCompleted.should.be.equal(true);

          //   let balances = await getBalances(trader1, trader2, feeAccount, token1, token2, weth);
          //   balances.trader1BalanceOfToken1.should.be.bignumber.equal(500);
          //   balances.trader1BalanceOfToken2.should.be.bignumber.equal(500);
          //   balances.trader1BalanceOfWETH.should.be.bignumber.equal(9.5e17);
          //   balances.trader2BalanceOfToken1.should.be.bignumber.equal(500);
          //   balances.trader2BalanceOfToken2.should.be.bignumber.equal(500);
          //   balances.trader2BalanceOfWETH.should.be.bignumber.equal(9.5e17);
          //   balances.feeAccountBalanceOfWETH.should.be.bignumber.equal(1e17)
          // })
//         }
//     });

//     describe('Rounding error', () => {
//         it('should return false if there is a rounding error of 0.1%', async () => {
//             const numerator = 20;
//             const denominator = 999;
//             const target = 50;
//             // rounding error = ((20*50/999) - floor(20*50/999)) / (20*50/999) = 0.1%
//             const isRoundingError = await exchange.isRoundingError.call(numerator, denominator, target);
//             isRoundingError.should.be.equal(false)
//         });

//         it('should return false if there is a rounding of 0.09%', async () => {
//             const numerator = 20;
//             const denominator = 9991;
//             const target = 500;
//             // rounding error = ((20*500/9991) - floor(20*500/9991)) / (20*500/9991) = 0.09%
//             const isRoundingError = await exchange.isRoundingError.call(numerator, denominator, target);
//             isRoundingError.should.be.equal(false)
//         });

//         it('should return true if there is a rounding error of 0.11%', async () => {
//             const numerator = 20;
//             const denominator = 9989;
//             const target = 500;
//             // rounding error = ((20*500/9989) - floor(20*500/9989)) / (20*500/9989) = 0.11%
//             const isRoundingError = await exchange.isRoundingError.call(numerator, denominator, target);
//             isRoundingError.should.be.equal(true)
//         });

//         it('should return true if there is a rounding error > 0.1%', async () => {
//             const numerator = 3;
//             const denominator = 7;
//             const target = 10;
//             // rounding error = ((3*10/7) - floor(3*10/7)) / (3*10/7) = 6.67%
//             const isRoundingError = await exchange.isRoundingError.call(numerator, denominator, target);
//             isRoundingError.should.be.equal(true)
//         });

//         it('should return false when there is no rounding error', async () => {
//             const numerator = 1;
//             const denominator = 2;
//             const target = 10;

//             const isRoundingError = await exchange.isRoundingError.call(numerator, denominator, target);
//             isRoundingError.should.be.equal(false)
//         });

//         it('should return false when there is rounding error <= 0.1%', async () => {
//             const numerator = 76564;
//             const denominator = 676373677;
//             const target = 105762562;
//             // rounding error = ((76564*105762562/676373677) - floor(76564*105762562/676373677)) /
//             // (76564*105762562/676373677) = 0.0007%
//             const isRoundingError = await exchange.isRoundingError.call(numerator, denominator, target);
//             isRoundingError.should.be.equal(false)
//         });
//     });

//     describe('Partial amount', () => {
//         it('should return (numerator*target)/denominator', async () => {
//             const numerator = 1;
//             const denominator = 2;
//             const target = 10;

//             const partialAmount = await exchange.getPartialAmount.call(numerator, denominator, target);
//             const expectedPartialAmount = 5;
//             partialAmount.should.be.bignumber.equal(expectedPartialAmount);
//         });

//         it('should round down', async () => {
//             const numerator = 2;
//             const denominator = 3;
//             const target = 10;

//             const partialAmount = await exchange.getPartialAmount.call(numerator, denominator, target);
//             const expectedPartialAmount = 6;
//             partialAmount.should.be.bignumber.equal(expectedPartialAmount);
//         });

//         it('should round .5 down', async () => {
//             const numerator = 1;
//             const denominator = 20;
//             const target = 10;

//             const partialAmount = await exchange.getPartialAmount.call(numerator, denominator, target);
//             const expectedPartialAmount = 0;
//             partialAmount.should.be.bignumber.equal(expectedPartialAmount);
//         });
//     });
// });