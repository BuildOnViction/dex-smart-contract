const { Wallet, Contract, utils } = require('ethers')
const { Exchange } = require('../utils/abis')
const { contractAddresses } = require('../config')
const { getNetworkID, getPrivateKeyFromEnvironment, getProvider } = require('../utils/helpers')

const network = process.argv[2]
if (!network) throw new Error('Usage: node test_exchange.js {network}')

const networkID = getNetworkID(network)
const pk = getPrivateKeyFromEnvironment(network)
const addresses = contractAddresses[networkID]
const provider = getProvider(network)
const signer = new Wallet(pk, provider)

const testExchange = async () => {
  try {
    const exchange = new Contract(addresses['Exchange'], Exchange, signer)

    const orderValuesArray = [
      [
        '1234000000000000000000',
        '2000000000000000000000000000000000000',
        '0',
        '8037105413944694',
        '13000000000000000000',
        '2000000000000000000000000000000000000',
        '1',
        '1005857135667269',
        '4000000000000000',
        '4000000000000000',
      ],
    ]

    const orderAddressesArray = [
      [
        '0x28074f8d0fd78629cd59290cac185611a8d60109',
        '0x28074f8d0fd78629cd59290cac185611a8d60109',
        '0x7D2d3073EaB94BA50F83A60Cea14020F0C906Da0',
        '0x53DDd545882dec853226dC8255268C7760276695',
      ],
    ]

    const amounts = [
      '13000000000000000000',
    ]

    const v = [
      [
        28,
        28,
      ],
    ]

    const rs = [
      [
        [
          247,
          94,
          127,
          181,
          163,
          102,
          32,
          151,
          177,
          67,
          184,
          197,
          59,
          127,
          246,
          190,
          176,
          227,
          68,
          130,
          64,
          193,
          139,
          208,
          56,
          124,
          0,
          229,
          180,
          198,
          222,
          226,
        ],
        [
          88,
          97,
          36,
          79,
          32,
          252,
          154,
          34,
          88,
          108,
          17,
          70,
          42,
          47,
          12,
          152,
          114,
          66,
          144,
          58,
          101,
          143,
          102,
          244,
          43,
          231,
          250,
          2,
          64,
          215,
          164,
          138,
        ],
        [
          212,
          77,
          53,
          236,
          42,
          192,
          58,
          19,
          10,
          113,
          252,
          24,
          150,
          99,
          92,
          131,
          146,
          76,
          69,
          194,
          38,
          216,
          143,
          178,
          59,
          31,
          212,
          255,
          172,
          88,
          236,
          12,
        ],
        [
          90,
          239,
          40,
          114,
          212,
          182,
          112,
          83,
          89,
          235,
          148,
          50,
          68,
          236,
          9,
          196,
          59,
          53,
          10,
          25,
          169,
          134,
          246,
          46,
          95,
          243,
          169,
          175,
          162,
          12,
          72,
          47,
        ],
      ],
    ]

    // const orderValues = [
    //   utils.bigNumberify('1234000000000000000000'),
    //   utils.bigNumberify('2000000000000000000000000000000000000'),
    //   '0',
    //   utils.bigNumberify('8037105413944694'),
    //   utils.bigNumberify('13000000000000000000'),
    //   utils.bigNumberify('2000000000000000000000000000000000000'),
    //   '1',
    //   utils.bigNumberify('1005857135667269'),
    //   utils.bigNumberify('4000000000000000'),
    //   utils.bigNumberify('4000000000000000'),
    // ]
    //
    // const orderAddresses = [
    //   '0x28074f8d0fd78629cd59290cac185611a8d60109',
    //   '0x28074f8d0fd78629cd59290cac185611a8d60109',
    //   '0x7D2d3073EaB94BA50F83A60Cea14020F0C906Da0',
    //   '0x53DDd545882dec853226dC8255268C7760276695',
    // ]

    // const amount = utils.bigNumberify('13000000000000000000')

    const tx = await exchange.executeBatchTrades(orderValuesArray, orderAddressesArray, amounts, v, rs)

    // const tx = await exchange.executeTrade(orderValues, orderAddresses, amount)
    const receipt = await signer.provider.waitForTransaction(tx.hash)

    if (receipt.status === 0) {
      console.log(`Transaction ${tx.hash} failed`)
    } else {
      console.log(`Test exchange success`)
    }
  } catch (err) {
    console.log(err)
  }
}

testExchange().then(() => console.log('Done'))
