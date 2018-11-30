const fs = require('fs');
const path = require('path');
const { utils, providers, Wallet, Contract } = require('ethers');
const { contractAddresses } = require('../config');
const { accounts } = require('./accounts.js');
const { ERC20 } = require('../utils/abis');

const truffleBuildPath = path.join(
  `${process.env.TOMO__DEX_PATH}`,
  `/build/contracts`
);

const pk =
  process.env.TOMO__RINKEBY_PRIVATE_KEY ||
  '0xf4f803220d23b4ae3b4fecbd0ed9d3c11137571fd1c619154619ef832c8f196f';
const ethereumNodeUrl = process.env.ETHEREUM_NODE_HTTP_URL;
const rinkebyAddresses = contractAddresses['4'];

let files = fs.readdirSync(truffleBuildPath);

let provider = new providers.InfuraProvider(
  'rinkeby',
  '63739bbdf74143aeb0e6d8bb8307084f'
);
let signer = new Wallet(pk, provider);

const queryTokenBalances = async () => {
  for (let account of accounts) {
    console.log(`**${account}**`);
    for (let symbol in rinkebyAddresses) {
      if (symbol !== 'Exchange') {
        let token = new Contract(rinkebyAddresses[symbol], ERC20, signer);
        let balance = await token.balanceOf(account);
        console.log(`${symbol}: ${balance}`);
      }
    }
  }
};

queryTokenBalances();
