const config = require('../config')

const BNB = artifacts.require('./contracts/tokens/BNB.sol')
const OMG = artifacts.require('./contracts/tokens/OMG.sol')
const ZRX = artifacts.require('./contracts/tokens/ZRX.sol')
const AE = artifacts.require('./contracts/tokens/AE.sol')
const TRX = artifacts.require('./contracts/tokens/TRX.sol')
const MKR = artifacts.require('./contracts/tokens/MKR.sol')
const BAT = artifacts.require('./contracts/tokens/BAT.sol')
const REP = artifacts.require('./contracts/tokens/REP.sol')
const BTM = artifacts.require('./contracts/tokens/BTM.sol')
const NPXS = artifacts.require('./contracts/tokens/NPXS.sol')
const WTC = artifacts.require('./contracts/tokens/WTC.sol')
const KCS = artifacts.require('./contracts/tokens/KCS.sol')
const GNT = artifacts.require('./contracts/tokens/GNT.sol')
const PPT = artifacts.require('./contracts/tokens/PPT.sol')
const SNT = artifacts.require('./contracts/tokens/SNT.sol')
const DGX = artifacts.require('./contracts/tokens/DGX.sol')
const MITH = artifacts.require('./contracts/tokens/MITH.sol')
const AION = artifacts.require('./contracts/tokens/AION.sol')
const LRC = artifacts.require('./contracts/tokens/LRC.sol')
const FUN = artifacts.require('./contracts/tokens/FUN.sol')
const KNC = artifacts.require('./contracts/tokens/KNC.sol')
const LOOM = artifacts.require('./contracts/tokens/LOOM.sol')
const PRFT = artifacts.require('./contracts/tokens/PRFT.sol')
const DAI = artifacts.require('./contracts/tokens/DAI.sol')

const tokens = []

const toTxHash = (value) => {
  if (typeof value === 'string') {
    // this is probably a tx hash already
    return value
  } else if (typeof value.receipt === 'object') {
    // this is probably a tx object
    return value.receipt.transactionHash
  }
  throw new Error('Unsupported tx type: ' + value)
}

const mineTx = (promiseOrTx, interval) => {
  return Promise.resolve(promiseOrTx)
    .then(tx => {
      const txHash = toTxHash(tx)

      return new Promise((resolve, reject) => {
        const getReceipt = () => {
          web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
            if (error) {
              reject(error)
            } else if (receipt) {
              resolve(receipt)
            } else {
              setTimeout(getReceipt, interval || 500)
            }
          })
        }

        getReceipt()
      })
    })
}

module.exports = function (deployer, network, accounts) {
  let admin, addresses
  // if (network === 'development') return

  if (network === 'rinkeby') {
    admin = accounts[0]
    addresses = config.accounts.rinkeby
  } else {
    admin = accounts[0]
    addresses = config.accounts.development
  }
  console.log(addresses)

  DAI.deployed()
    .then(async (_token1) => {
      tokens[0] = _token1
      // tokens[1] = await OMG.deployed()
      tokens[1] = await ZRX.deployed()
      tokens[2] = await AE.deployed()
      // tokens[4] = await TRX.deployed()
      // tokens[5] = await MKR.deployed()
      tokens[3] = await BAT.deployed()
      // tokens[7] = await REP.deployed()
      // tokens[8] = await BTM.deployed()
      // tokens[9] = await NPXS.deployed()
      // tokens[10] = await WTC.deployed()
      // tokens[11] = await KCS.deployed()
      // tokens[12] = await GNT.deployed()
      // tokens[13] = await PPT.deployed()
      // tokens[14] = await SNT.deployed()
      // tokens[15] = await DGX.deployed()
      // tokens[16] = await MITH.deployed()
      // tokens[17] = await AION.deployed()
      // tokens[18] = await LRC.deployed()
      // tokens[19] = await FUN.deployed()
      // tokens[20] = await KNC.deployed()
      // tokens[21] = await LOOM.deployed()
      // tokens[22] = await PRFT.deployed()
      // tokens[23] = await DAI.deployed()

      const transfers = []

      try {
        for (let i = 0; i < tokens.length - 1; i++) {
          for (let j = 0; j < addresses.length - 1; j++) {
            transfers.push(tokens[i].transfer(addresses[j], 1e2 * 1e18, { from: admin }))
          }
        }

        await Promise.all(transfers)
      } catch (e) {
        console.log(e.message)
      }
    })
}
