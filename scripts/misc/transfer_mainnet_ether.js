const { accounts } = require('./accounts.js');
const { utils, providers, Wallet } = require('ethers');

const pk = process.env.TOMO__MAINNET_PRIVATE_KEY;

const provider = new providers.InfuraProvider('homestead');
const signer = new Wallet(pk, provider);
const round = (n, decimals = '2') =>
  Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals);

const transferEther = async () => {
  let tx = await signer.sendTransaction({
    to: utils.getAddress(process.argv[3]),
    value: utils.parseEther(process.argv[2])
  });

  let receipt = await signer.provider.waitForTransaction(tx.hash);
  if (receipt.status === 0) {
    console.log(`Transaction ${tx.hash} failed`);
  } else {
    console.log(`Transaction ${tx.hash} successful`);
  }
};

transferEther();
