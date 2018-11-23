const { accounts } = require('./accounts.js')
// const pk = process.env.AMP_RINKEBY_PRIVATE_KEY || '0xf4f803220d23b4ae3b4fecbd0ed9d3c11137571fd1c619154619ef832c8f196f'
const pk = 'c5ce7f5e94352a2728360f66de16130ae5b365360392b7946abd4151dd794607'
const { utils, providers, Wallet } = require('ethers')


const provider = new providers.InfuraProvider('rinkeby')
const signer = new Wallet(pk, provider)
const round = (n, decimals = '2') => Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals)

const transferEther = async () => {
  let tx = await signer.sendTransaction({
    to: utils.getAddress(process.argv[3]),
    value: utils.parseEther(process.argv[2])
  })

  let receipt = await signer.provider.waitForTransaction(tx.hash)
  if (receipt.status === 0) {
    console.log(`Transaction ${tx.hash} failed`)
  } else {
    console.log(`Transaction ${tx.hash} successful`)
  }
}

transferEther()

