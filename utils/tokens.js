var TruffleContract = require('truffle-contract');
var Web3 = require('web3');

const provider = new Web3.providers.HttpProvider('http://localhost:8545');

Promise.all(
  'Exchange,ZRX,MKR,BAT,REP,BTM,NPXS,OMG,WTC,KCS,GNT,TRX,TOMO,PPT,SNT,FUN,MITH,AE,LRC,KNC,LOOM,WETH,DAI,DGX,AION'
    .split(',')
    .map(async token => {
      const artifact = require(`../build/contracts/${token}.json`);
      const ThisContract = TruffleContract(artifact);
      ThisContract.setProvider(provider);
      if (typeof ThisContract.currentProvider.sendAsync !== 'function') {
        ThisContract.currentProvider.sendAsync = function() {
          return ThisContract.currentProvider.send.apply(
            ThisContract.currentProvider,
            arguments
          );
        };
      }
      try {
        const instance = await ThisContract.deployed();
        const symbol = instance.symbol ? await instance.symbol() : token;
        return {
          symbol,
          address: instance.address
        };
      } catch (e) {
        console.log(e);
        return null;
      }
    })
).then(list => {
  const ret = list
    .filter(item => item !== null)
    .reduce((map, { symbol, address }) => (map[symbol] = address) && map, {});

  console.log(JSON.stringify(ret, null, 2));
});
