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

const accounts = web3.eth.accounts;
const admin = accounts[0];
web3.personal.unlockAccount(admin, '123456789', 10000);
let tokens = [];

module.exports = function(deployer) {
  // example of transfer AE to admin
  // AE.at('0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d').then(async token => {
  //   await token.transfer(admin, 1000000e18, { from: admin });
  // });

  TOMO.deployed().then(async _token1 => {
    tokens[0] = _token1;
    tokens[1] = await OMG.deployed();
    tokens[2] = await ZRX.deployed();
    tokens[3] = await AE.deployed();
    tokens[4] = await TRX.deployed();
    tokens[5] = await MKR.deployed();
    tokens[6] = await BAT.deployed();
    tokens[7] = await REP.deployed();
    tokens[8] = await BTM.deployed();
    tokens[9] = await NPXS.deployed();
    tokens[10] = await WTC.deployed();
    tokens[11] = await KCS.deployed();
    tokens[12] = await GNT.deployed();
    tokens[13] = await PPT.deployed();
    tokens[14] = await SNT.deployed();
    tokens[15] = await DGX.deployed();
    tokens[16] = await MITH.deployed();
    tokens[17] = await AION.deployed();
    tokens[18] = await LRC.deployed();
    tokens[19] = await FUN.deployed();
    tokens[20] = await KNC.deployed();
    tokens[21] = await LOOM.deployed();
    tokens[22] = await PRFT.deployed();
    tokens[23] = await DAI.deployed();

    let tokenTransfers = [];

    for (let token of tokens) {
      for (let account of accounts) {
        tokenTransfers.push(
          token.transfer(account, 1000000e18, { from: admin })
        );
      }
    }

    await Promise.all(tokenTransfers);
  });
};
