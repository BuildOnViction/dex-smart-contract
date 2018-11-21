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
    const admin = accounts[0];
    // web3.personal.unlockAccount(admin, '123456789', 10000);

    await deployer.deploy(OMG, admin, 10000000000e18);
    await deployer.deploy(ZRX, admin, 10000000000e18);
    await deployer.deploy(AE, admin, 10000000000e18);
    await deployer.deploy(TRX, admin, 10000000000e18);
    await deployer.deploy(MKR, admin, 10000000000e18);
    await deployer.deploy(BAT, admin, 10000000000e18);
    await deployer.deploy(REP, admin, 10000000000e18);
    await deployer.deploy(BTM, admin, 10000000000e18);
    await deployer.deploy(NPXS, admin, 10000000000e18);
    await deployer.deploy(WTC, admin, 10000000000e18);
    await deployer.deploy(KCS, admin, 10000000000e18);
    await deployer.deploy(GNT, admin, 10000000000e18);
    await deployer.deploy(PPT, admin, 10000000000e18);
    await deployer.deploy(SNT, admin, 10000000000e18);
    await deployer.deploy(DGX, admin, 10000000000e18);
    await deployer.deploy(MITH, admin, 10000000000e18);
    await deployer.deploy(AION, admin, 10000000000e18);
    await deployer.deploy(LRC, admin, 10000000000e18);
    await deployer.deploy(FUN, admin, 10000000000e18);
    await deployer.deploy(LRC, admin, 10000000000e18);
    await deployer.deploy(FUN, admin, 10000000000e18);
    await deployer.deploy(KNC, admin, 10000000000e18);
    await deployer.deploy(LOOM, admin, 10000000000e18);
    await deployer.deploy(PRFT, admin, 10000000000e18);
    await deployer.deploy(DAI, admin, 10000000000e18);
  })
};