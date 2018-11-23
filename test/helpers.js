/* global web3: true */
import moment from 'moment'

/**
 * @module Helpers
 */
var Promise = require('bluebird')
let chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
chai.should()
chai.use(chaiAsPromised)

/**
 * @description Returns a promise that is resolve when transactions corresponding to input hashes are resolved
 * @param {String[]} txnHashes - Array (or simple String) of transaction hashes
 * @returns {Promise} resolved upon mining of all input transaction {Promise}
 */
const waitUntilTransactionsMined = (txnHashes) => {
  var transactionReceiptAsync
  const interval = 500
  transactionReceiptAsync = function (txnHashes, resolve, reject) {
    try {
      var receipt = web3.eth.getTransactionReceipt(txnHashes)
      if (receipt == null) {
        setTimeout(function () {
          transactionReceiptAsync(txnHashes, resolve, reject)
        }, interval)
      } else {
        resolve(receipt)
      }
    } catch (e) {
      reject(e)
    }
  }

  if (Array.isArray(txnHashes)) {
    var promises = []
    txnHashes.forEach(function (txnHash) {
      promises.push(waitUntilTransactionsMined(txnHash))
    })
    return Promise.all(promises)
  } else {
    return new Promise(function (resolve, reject) { transactionReceiptAsync(txnHashes, resolve, reject) })
  }
}

/**
 * @description Returns the balance of an ethereum wallet
 * @param address {String} - Ethereum address
 * @returns {Number} Wallet balance
 */
const getWeiBalance = (address) => {
  let balance = web3.eth.getBalance(address)
  return balance.toNumber()
}

/**
 * @description Returns the balance of several ethereum wallets (in wei)
 * @param addresses {String[]} - Array of ethereum addresses
 * @returns {Number[]} wallet balances (in wei)
 */
const getWeiBalances = (addresses) => {
  let balances = []
  addresses.map(function (address) { balances.push(getWeiBalance(address)) })
  return balances
}

/**
 * @description Returns the balance of an ethereum wallet (in ether)
 * @param address {String} - Ethereum address
 * @returns {Number} wallet balance (in ether)
 */
const getEtherBalance = (address) => {
  let balance = web3.fromWei(web3.eth.getBalance(address), 'ether')
  return balance.toNumber()
}

/**
 * @description Returns the balance of several ethereum wallets (in ether)
 * @param {String[]} addresses
 * @returns {Number[]} wallet balances (in ether)
 */
const getEtherBalances = (addresses) => {
  let balances = []
  addresses.forEach(function (address) { balances.push(getEtherBalance(address)) })
  return balances
}

/**
 * @description Converts wei to ether
 * @param valueInWei {Number}
 * @returns {Number} Converted value in ether
 */
const inEther = (valueInWei) => {
  let amount = web3.fromWei(valueInWei, 'ether')
  return Number(amount)
}

/**
 * @description Converts ether to wei
 * @param {Number} valueInEther - Ether value to be converted
 * @returns {Number} - Converted wei value
 */
const inWei = (valueInEther) => {
  let amount = web3.toWei(valueInEther, 'ether')
  return amount.toNumber()
}

// in our case the base units are cents
/**
 * @description Convert tokens cents to token units
 * @param {Number} tokenCents - Value in token cents
 * @returns {Number} token base units
 */
const inBaseUnits = (tokenCents) => {
  return tokenCents / (10 ** 2)
}

/**
 * @description Converts token units to token cents
 * @param {Number} tokenBaseUnits
 * @returns {Number} token cents
 */
const inCents = (tokenBaseUnits) => {
  return tokenBaseUnits * (10 ** 2)
}

/**
 * @description Converts token base units (ERC20 units) to token units
 * @param {Number} tokenBaseUnits
 * @returns {Number} token units
 */
const inTokenUnits = (tokenBaseUnits) => {
  return tokenBaseUnits / (10 ** 18)
}

/**
 * @description Returns address corresponding to a contract
 * @param contract {Object} - Truffle Contract Object
 * @returns address {String}
 */
const getAddress = async (contract) => {
  let address = contract.address
  return address
}

/**
 * @description Returns the addresses corresponding to an array of contracts
 * @param contracts {Object} - Array of truffle contract objects
 * @returns address[] {String[]}
 */
const getAddresses = async (contracts) => {
  let addresses = contracts.map(function (contract) {
    return contract.address
  })
  return addresses
}

/**
 * @description Send an ethereum transaction and wait until the transaction is mined
 * @param txn {Object} Web3 transaction object
 * @returns txnReceipt {Object} transaction receipt
 */
const sendTransaction = async (txn) => {
  let txnHash = await web3.eth.sendTransaction(txn)
  let txnReceipt = await waitUntilTransactionsMined(txnHash)
  return txnReceipt
}

/**
 * @description Send ethereum transactions and wait until all transactions are mined
 * @param txns {Object} Web3 transactions object
 * @returns txnReceipts {Object} transaction receipts
 */
const sendTransactions = async (txns) => {
  let txnHashes = []
  let txnHash

  for (let txn of txns) {
    txnHash = await sendTransaction(txn)
    txnHashes.push(txnHash)
  }

  return txnHashes
}

/**
 * @description Fails if the input promise is not rejected with an Invalid opcode message
 * @param promise
 */
const expectInvalidOpcode = async (promise) => {
  try {
    await promise
  } catch (error) {
    expect(error.message).to.include('invalid opcode')
    return
  }
  expect.fail('Expected throw not received')
}

/**
 * @description Fails if the input promise is not rejected with a Revert message
 * @param promise
 */
const expectRevert = async (promise) => {
  try {
    await promise
  } catch (error) {
    expect(error.message).to.include('revert')
    return
  }
  expect.fail('Expected revert not received')
}

/**
 * @description Fails if the input promise is not reject with an Invalid jump message
 * @param promise
 */
const expectInvalidJump = async (promise) => {
  try {
    await promise
  } catch (error) {
    expect(error.message).to.include('invalid JUMP')
    return
  }
  expect.fail('Expected throw not received')
}

/**
 * @description Fails if the input promise is not rejected with an Out of Gas message
 * @param promise
 */
const expectOutOfGas = async (promise) => {
  try {
    await promise
  } catch (error) {
    expect(error.message).to.include('out of gas')
    return
  }
  expect.fail('Expected throw not received')
}

/**
 * @description Mine the local evm
 * @returns promise
 */
const advanceBlock = () => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_mine',
      id: Date.now(),
    }, (err, res) => {
      return err ? reject(err) : resolve(err)
    })
  })
}

/**
 * @description Advance to input block
 * @param {Number} number
 */
const advanceToBlock = async(number) => {
  if (web3.eth.blockNumber > number) {
    throw Error(`block number ${number} is in the past (current is ${web3.eth.blockNumber})`)
  }
  while (web3.eth.blockNumber < number) {
    await advanceBlock()
  }
}

const advanceNBlocks = async(number) => {
  let initialBlockNumber = web3.eth.blockNumber
  if (number < 0) {
    throw Error(`number should be a strictly positive number`)
  }
  while(web3.eth.blockNumber < initialBlockNumber + number) {
    await advanceBlock()
  }
}


/**
 * @description Returns timestamp corresponding to latest block
 * @returns {Number} Latest timestamp
 */
const latestTime = function() {
  return moment.unix(web3.eth.getBlock('latest').timestamp)
}

/**
 * @description Advance EVM by a certain amount of time
 * @param {Number} duration
 * @returns {Promise}
 */
const increaseTime = function(duration) {
  const id = Date.now()

  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [duration.asSeconds()],
      id: id,
    }, err1 => {
      if (err1) return reject(err1)

      web3.currentProvider.sendAsync({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: id+1,
      }, (err2, res) => {
        return err2 ? reject(err2) : resolve(res)
      })
    })
  })
}

/**
 * @description Not sure what this function does
 */
const getTxnReceiptData = (txnReceipt) => {
  let logs = txnReceipt.logs
  let dataArray = []
  logs.forEach(log => {
    let data = log.data
    if (data) {
      dataArray.push(data)
    } else {
      dataArray.push('no data')
    }
  })

  return dataArray
}

/**
 * @description Takes a transaction receipt as argument and returns a log of topics corresponding to this transaction
 * @param {Object} txnReceipt
 * @returns {Array} - Array of topics associated to the transaction receipt
 */
const getTxnReceiptTopics = (txnReceipt) => {
  let logs = txnReceipt.logs

  let topics = logs.map(log => {
    let topics = log.topics
    let result = {
      'functionID': topics[0],
      'parameters': topics.slice(1)
    }
    return result
  })
  return topics
}

/**
 * @description Computes the epoch corresponding to a certain blocknumber
 * @param {Number} currentBlockNumber
 * @param {Number} initialBlockNumber
 * @param {Number} blockPerEpoch
 * @returns {Number} - Epoch number
 */
const computeEpoch = (currentBlockNumber, initialBlockNumber, blocksPerEpoch) => {
  let expectedEpoch = (currentBlockNumber - initialBlockNumber.toNumber()) / (blocksPerEpoch)
  expectedEpoch = Math.floor(expectedEpoch)
  return expectedEpoch
}

/**
 * @description Computes the blocknumber of the first block corresponding to an epoch
 * @param {Number} epochIndex
 * @param {Number} creationBlockNumber
 * @param {Number} blockPerEpoch
 * @returns {Number} - Blocknumber at epoch start
 */
const computeBlockNumberAtEpochStart = (epochIndex, creationBlockNumber, blocksPerEpoch) => {
  return (creationBlockNumber.toNumber() + epochIndex * blocksPerEpoch)
}

module.exports = {
  waitUntilTransactionsMined,
  getWeiBalance,
  getWeiBalances,
  getEtherBalance,
  getEtherBalances,
  inEther,
  inWei,
  inBaseUnits,
  inTokenUnits,
  inCents,
  getAddress,
  getAddresses,
  sendTransaction,
  sendTransactions,
  expectInvalidOpcode,
  expectInvalidJump,
  expectOutOfGas,
  expectRevert,
  advanceToBlock,
  getTxnReceiptData,
  getTxnReceiptTopics,
  latestTime,
  increaseTime,
  advanceNBlocks,
  computeEpoch,
  computeBlockNumberAtEpochStart
}