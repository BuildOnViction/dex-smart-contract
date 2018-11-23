// const config = require('../config')

const Exchange = artifacts.require('./Exchange.sol');
const WETH = artifacts.require('./contracts/utils/WETH.sol');
const TOMO = artifacts.require('./contracts/tokens/TOMO.sol');
const OMG = artifacts.require('./contracts/tokens/OMG.sol');
const ZRX = artifacts.require('./contracts/tokens/ZRX.sol');
const AE = artifacts.require('./contracts/tokens/AE.sol');
const TRX = artifacts.require('./contracts/tokens/TRX.sol');
const MKR = artifacts.require('./contracts/tokens/MKR.sol');
const BAT = artifacts.require('./contracts/tokens/BAT.sol');
const REP = artifacts.require('./contracts/tokens/REP.sol');
const BTM = artifacts.require('./contracts/tokens/BTM.sol');
const NPXS = artifacts.require('./contracts/tokens/NPXS.sol');
const WTC = artifacts.require('./contracts/tokens/WTC.sol');
const KCS = artifacts.require('./contracts/tokens/KCS.sol');
const GNT = artifacts.require('./contracts/tokens/GNT.sol');
const PPT = artifacts.require('./contracts/tokens/PPT.sol');
const SNT = artifacts.require('./contracts/tokens/SNT.sol');
const DGX = artifacts.require('./contracts/tokens/DGX.sol');
const MITH = artifacts.require('./contracts/tokens/MITH.sol');
const AION = artifacts.require('./contracts/tokens/AION.sol');
const LRC = artifacts.require('./contracts/tokens/LRC.sol');
const FUN = artifacts.require('./contracts/tokens/FUN.sol');
const KNC = artifacts.require('./contracts/tokens/KNC.sol');
const LOOM = artifacts.require('./contracts/tokens/LOOM.sol');
const PRFT = artifacts.require('./contracts/tokens/PRFT.sol');
const DAI = artifacts.require('./contracts/tokens/DAI.sol');

module.exports = function (deployer, network, accounts) {

  deployer.then(async () => {
    // const admin = network === 'development' ? accounts[0] : accounts[1];
    // web3.personal.unlockAccount(admin, '123456789', 10000);
    let exchange;
    let tokens = [];

    exchange = await Exchange.deployed();
    tokens[tokens.length] = await WETH.deployed();
    tokens[tokens.length] = await TOMO.deployed();
    tokens[tokens.length] = await OMG.deployed();
    tokens[tokens.length] = await ZRX.deployed();
    tokens[tokens.length] = await AE.deployed();
    tokens[tokens.length] = await TRX.deployed();
    tokens[tokens.length] = await MKR.deployed();
    tokens[tokens.length] = await BAT.deployed();
    tokens[tokens.length] = await REP.deployed();
    tokens[tokens.length] = await BTM.deployed();
    tokens[tokens.length] = await NPXS.deployed();
    tokens[tokens.length] = await WTC.deployed();
    tokens[tokens.length] = await KCS.deployed();
    tokens[tokens.length] = await GNT.deployed();
    tokens[tokens.length] = await PPT.deployed();
    tokens[tokens.length] = await SNT.deployed();
    tokens[tokens.length] = await DGX.deployed();
    tokens[tokens.length] = await MITH.deployed();
    tokens[tokens.length] = await AION.deployed();
    tokens[tokens.length] = await LRC.deployed();
    tokens[tokens.length] = await FUN.deployed();
    tokens[tokens.length] = await KNC.deployed();
    tokens[tokens.length] = await LOOM.deployed();
    tokens[tokens.length] = await PRFT.deployed();
    tokens[tokens.length] = await DAI.deployed();

    let tokenApprovals = [];
    // let addresses = config.accounts.development

    for (let token of tokens) {
      for (let account of accounts) {
        tokenApprovals.push(
          token.approve(exchange.address, 1000000e18, {
            from: account
          })
        );
      }

      // for (let address of addresses) {
      //   tokenApprovals.push(
      //     token.approve(exchange.address, 1000000e18, {
      //       from: address
      //     })
      //   );
      // }
    }

    try {
      await Promise.all(tokenApprovals);
    } catch (e) {
      console.log(e);
    }

  })
};