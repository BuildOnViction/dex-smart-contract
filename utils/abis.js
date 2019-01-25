const ERC20 = [
  {
    'constant': true,
    'inputs': [],
    'name': 'mintingFinished',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'setOwner',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'owner',
    'outputs': [
      {
        'name': '',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'symbol',
    'outputs': [
      {
        'name': '',
        'type': 'string',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'name': '_to',
        'type': 'address',
      },
      {
        'name': '_amount',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'constructor',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'from',
        'type': 'address',
      },
      {
        'indexed': true,
        'name': 'to',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'value',
        'type': 'uint256',
      },
    ],
    'name': 'Transfer',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'owner',
        'type': 'address',
      },
      {
        'indexed': true,
        'name': 'spender',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'value',
        'type': 'uint256',
      },
    ],
    'name': 'Approval',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'to',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'amount',
        'type': 'uint256',
      },
    ],
    'name': 'Mint',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [],
    'name': 'MintFinished',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'previousOwner',
        'type': 'address',
      },
      {
        'indexed': true,
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'SetOwner',
    'type': 'event',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'totalSupply',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_to',
        'type': 'address',
      },
      {
        'name': '_value',
        'type': 'uint256',
      },
    ],
    'name': 'transfer',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '_owner',
        'type': 'address',
      },
    ],
    'name': 'balanceOf',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_from',
        'type': 'address',
      },
      {
        'name': '_to',
        'type': 'address',
      },
      {
        'name': '_value',
        'type': 'uint256',
      },
    ],
    'name': 'transferFrom',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_spender',
        'type': 'address',
      },
      {
        'name': '_value',
        'type': 'uint256',
      },
    ],
    'name': 'approve',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '_owner',
        'type': 'address',
      },
      {
        'name': '_spender',
        'type': 'address',
      },
    ],
    'name': 'allowance',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_spender',
        'type': 'address',
      },
      {
        'name': '_addedValue',
        'type': 'uint256',
      },
    ],
    'name': 'increaseApproval',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_spender',
        'type': 'address',
      },
      {
        'name': '_subtractedValue',
        'type': 'uint256',
      },
    ],
    'name': 'decreaseApproval',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_to',
        'type': 'address',
      },
      {
        'name': '_amount',
        'type': 'uint256',
      },
    ],
    'name': 'mint',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [],
    'name': 'finishMinting',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
]

const WETH = [
  {
    'constant': true,
    'inputs': [],
    'name': 'name',
    'outputs': [
      {
        'name': '',
        'type': 'string',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'decimals',
    'outputs': [
      {
        'name': '',
        'type': 'uint8',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '',
        'type': 'address',
      },
    ],
    'name': 'balanceOf',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'symbol',
    'outputs': [
      {
        'name': '',
        'type': 'string',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '',
        'type': 'address',
      },
      {
        'name': '',
        'type': 'address',
      },
    ],
    'name': 'allowance',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'payable': true,
    'stateMutability': 'payable',
    'type': 'fallback',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'src',
        'type': 'address',
      },
      {
        'indexed': true,
        'name': 'guy',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'wad',
        'type': 'uint256',
      },
    ],
    'name': 'Approval',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'src',
        'type': 'address',
      },
      {
        'indexed': true,
        'name': 'dst',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'wad',
        'type': 'uint256',
      },
    ],
    'name': 'Transfer',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'dst',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'wad',
        'type': 'uint256',
      },
    ],
    'name': 'Deposit',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'src',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'wad',
        'type': 'uint256',
      },
    ],
    'name': 'Withdrawal',
    'type': 'event',
  },
  {
    'constant': false,
    'inputs': [],
    'name': 'deposit',
    'outputs': [],
    'payable': true,
    'stateMutability': 'payable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'wad',
        'type': 'uint256',
      },
    ],
    'name': 'withdraw',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'totalSupply',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'guy',
        'type': 'address',
      },
      {
        'name': 'wad',
        'type': 'uint256',
      },
    ],
    'name': 'approve',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'dst',
        'type': 'address',
      },
      {
        'name': 'wad',
        'type': 'uint256',
      },
    ],
    'name': 'transfer',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'src',
        'type': 'address',
      },
      {
        'name': 'dst',
        'type': 'address',
      },
      {
        'name': 'wad',
        'type': 'uint256',
      },
    ],
    'name': 'transferFrom',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
]

const Exchange = [
  {
    'constant': true,
    'inputs': [],
    'name': 'rewardAccount',
    'outputs': [
      {
        'name': '',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'setOwner',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '',
        'type': 'address',
      },
    ],
    'name': 'operators',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '',
        'type': 'bytes32',
      },
    ],
    'name': 'filled',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '',
        'type': 'bytes32',
      },
    ],
    'name': 'pairs',
    'outputs': [
      {
        'name': 'pairID',
        'type': 'bytes32',
      },
      {
        'name': 'baseToken',
        'type': 'address',
      },
      {
        'name': 'quoteToken',
        'type': 'address',
      },
      {
        'name': 'pricepointMultiplier',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'owner',
    'outputs': [
      {
        'name': '',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '',
        'type': 'bytes32',
      },
    ],
    'name': 'traded',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'VERSION',
    'outputs': [
      {
        'name': '',
        'type': 'string',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'name': '_rewardAccount',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'constructor',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'name': 'oldRewardAccount',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'newRewardAccount',
        'type': 'address',
      },
    ],
    'name': 'LogRewardAccountUpdate',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'name': 'operator',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'isOperator',
        'type': 'bool',
      },
    ],
    'name': 'LogOperatorUpdate',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'name': 'makerOrderHashes',
        'type': 'bytes32[]',
      },
      {
        'indexed': false,
        'name': 'takerOrderHashes',
        'type': 'bytes32[]',
      },
      {
        'indexed': true,
        'name': 'tokenPairHash',
        'type': 'bytes32',
      },
    ],
    'name': 'LogBatchTrades',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'maker',
        'type': 'address',
      },
      {
        'indexed': true,
        'name': 'taker',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'tokenSell',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'tokenBuy',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'filledAmountSell',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'name': 'filledAmountBuy',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'name': 'paidFeeMake',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'name': 'paidFeeTake',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'name': 'orderHash',
        'type': 'bytes32',
      },
      {
        'indexed': false,
        'name': 'tradeHash',
        'type': 'bytes32',
      },
      {
        'indexed': true,
        'name': 'tokenPairHash',
        'type': 'bytes32',
      },
    ],
    'name': 'LogTrade',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'name': 'errorId',
        'type': 'uint8',
      },
      {
        'indexed': false,
        'name': 'makerOrderHash',
        'type': 'bytes32',
      },
      {
        'indexed': false,
        'name': 'takerOrderHash',
        'type': 'bytes32',
      },
    ],
    'name': 'LogError',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'name': 'orderHash',
        'type': 'bytes32',
      },
      {
        'indexed': false,
        'name': 'userAddress',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'baseToken',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'quoteToken',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'amount',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'name': 'pricepoint',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'name': 'side',
        'type': 'uint256',
      },
    ],
    'name': 'LogCancelOrder',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'previousOwner',
        'type': 'address',
      },
      {
        'indexed': true,
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'SetOwner',
    'type': 'event',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_baseToken',
        'type': 'address',
      },
      {
        'name': '_quoteToken',
        'type': 'address',
      },
      {
        'name': '_pricepointMultiplier',
        'type': 'uint256',
      },
    ],
    'name': 'registerPair',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '_baseToken',
        'type': 'address',
      },
      {
        'name': '_quoteToken',
        'type': 'address',
      },
    ],
    'name': 'getPairMultiplier',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '_baseToken',
        'type': 'address',
      },
      {
        'name': '_quoteToken',
        'type': 'address',
      },
    ],
    'name': 'pairIsRegistered',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_rewardAccount',
        'type': 'address',
      },
    ],
    'name': 'setRewardAccount',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_operator',
        'type': 'address',
      },
      {
        'name': '_isOperator',
        'type': 'bool',
      },
    ],
    'name': 'setOperator',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'orderValues',
        'type': 'uint256[10][]',
      },
      {
        'name': 'orderAddresses',
        'type': 'address[4][]',
      },
      {
        'name': 'amounts',
        'type': 'uint256[]',
      },
      {
        'name': 'v',
        'type': 'uint8[2][]',
      },
      {
        'name': 'rs',
        'type': 'bytes32[4][]',
      },
    ],
    'name': 'executeBatchTrades',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'orderValues',
        'type': 'uint256[10]',
      },
      {
        'name': 'orderAddresses',
        'type': 'address[4]',
      },
      {
        'name': 'amount',
        'type': 'uint256',
      },
      {
        'name': 'v',
        'type': 'uint8[2]',
      },
      {
        'name': 'rs',
        'type': 'bytes32[4]',
      },
    ],
    'name': 'executeSingleTrade',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'orderValues',
        'type': 'uint256[10]',
      },
      {
        'name': 'orderAddresses',
        'type': 'address[4]',
      },
      {
        'name': 'v',
        'type': 'uint8[2]',
      },
      {
        'name': 'rs',
        'type': 'bytes32[4]',
      },
    ],
    'name': 'validateSignatures',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'orderValues',
        'type': 'uint256[10]',
      },
      {
        'name': 'orderAddresses',
        'type': 'address[4]',
      },
      {
        'name': 'amount',
        'type': 'uint256',
      },
    ],
    'name': 'executeTrade',
    'outputs': [
      {
        'name': '',
        'type': 'bytes32',
      },
      {
        'name': '',
        'type': 'bytes32',
      },
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'orderValues',
        'type': 'uint256[6][]',
      },
      {
        'name': 'orderAddresses',
        'type': 'address[3][]',
      },
      {
        'name': 'v',
        'type': 'uint8[]',
      },
      {
        'name': 'r',
        'type': 'bytes32[]',
      },
      {
        'name': 's',
        'type': 'bytes32[]',
      },
    ],
    'name': 'batchCancelOrders',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'orderValues',
        'type': 'uint256[6]',
      },
      {
        'name': 'orderAddresses',
        'type': 'address[3]',
      },
      {
        'name': 'v',
        'type': 'uint8',
      },
      {
        'name': 'r',
        'type': 'bytes32',
      },
      {
        'name': 's',
        'type': 'bytes32',
      },
    ],
    'name': 'cancelOrder',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': 'signer',
        'type': 'address',
      },
      {
        'name': 'hash',
        'type': 'bytes32',
      },
      {
        'name': 'v',
        'type': 'uint8',
      },
      {
        'name': 'r',
        'type': 'bytes32',
      },
      {
        'name': 's',
        'type': 'bytes32',
      },
    ],
    'name': 'isValidSignature',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'pure',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': 'numerator',
        'type': 'uint256',
      },
      {
        'name': 'denominator',
        'type': 'uint256',
      },
      {
        'name': 'target',
        'type': 'uint256',
      },
    ],
    'name': 'isRoundingError',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'pure',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': 'numerator',
        'type': 'uint256',
      },
      {
        'name': 'denominator',
        'type': 'uint256',
      },
      {
        'name': 'target',
        'type': 'uint256',
      },
    ],
    'name': 'getPartialAmount',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'pure',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'orderAddresses',
        'type': 'address[4]',
      },
      {
        'name': 'makerOrderHashes',
        'type': 'bytes32[]',
      },
      {
        'name': 'takerOrderHashes',
        'type': 'bytes32[]',
      },
    ],
    'name': 'emitLog',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
]

const RewardPools = [
  {
    'constant': true,
    'inputs': [],
    'name': 'currentPoolIndex',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'proofToken',
    'outputs': [
      {
        'name': '',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'setOwner',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'creationBlockNumber',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'name': 'quoteTokenList',
    'outputs': [
      {
        'name': '',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '',
        'type': 'address',
      },
    ],
    'name': 'quotes',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'currentEpoch',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '',
        'type': 'address',
      },
    ],
    'name': 'withdrawals',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'owner',
    'outputs': [
      {
        'name': '',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'rewardCollector',
    'outputs': [
      {
        'name': '',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '',
        'type': 'uint256',
      },
      {
        'name': '',
        'type': 'address',
      },
    ],
    'name': 'poolBalances',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'currentPoolBalance',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'blocksPerEpoch',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'name': '_PRFTAddress',
        'type': 'address',
      },
      {
        'name': '_rewardCollector',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'constructor',
  },
  {
    'payable': true,
    'stateMutability': 'payable',
    'type': 'fallback',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'previousOwner',
        'type': 'address',
      },
      {
        'indexed': true,
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'SetOwner',
    'type': 'event',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '_accountAddress',
        'type': 'address',
      },
      {
        'name': '_tokenAddress',
        'type': 'address',
      },
    ],
    'name': 'totalUserReward',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_poolEpoch',
        'type': 'uint256',
      },
      {
        'name': '_tokenAddress',
        'type': 'address',
      },
    ],
    'name': 'balanceOfPool',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_tokenAddress',
        'type': 'address',
      },
    ],
    'name': 'removeQuoteToken',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_tokenAddress',
        'type': 'address',
      },
    ],
    'name': 'registerQuoteToken',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [],
    'name': 'withdrawRewards',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'computeCurrentEpoch',
    'outputs': [
      {
        'name': 'computedCurrentEpoch',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '_epoch',
        'type': 'uint256',
      },
    ],
    'name': 'getBlockNumberAtEpochStart',
    'outputs': [
      {
        'name': 'blockNumber',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
]

const RewardCollector = [
  {
    'constant': true,
    'inputs': [],
    'name': 'proofToken',
    'outputs': [
      {
        'name': '',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'setOwner',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'owner',
    'outputs': [
      {
        'name': '',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'rewardPools',
    'outputs': [
      {
        'name': '',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'name': '_PRFTAddress',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'constructor',
  },
  {
    'payable': true,
    'stateMutability': 'payable',
    'type': 'fallback',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'previousOwner',
        'type': 'address',
      },
      {
        'indexed': true,
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'SetOwner',
    'type': 'event',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_rewardPools',
        'type': 'address',
      },
    ],
    'name': 'setRewardPools',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_tokenAddress',
        'type': 'address',
      },
      {
        'name': '_value',
        'type': 'uint256',
      },
    ],
    'name': 'transferTokensToPool',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
]

const SetupAccount = [
  {
    'constant': true,
    'inputs': [],
    'name': 'wethAddress',
    'outputs': [
      {
        'name': '',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'exchangeAddress',
    'outputs': [
      {
        'name': '',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'name': '_exchangeAddress',
        'type': 'address',
      },
      {
        'name': '_wethAddress',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'constructor',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_tokenAddress',
        'type': 'address',
      },
      {
        'name': '_value',
        'type': 'uint256',
      },
    ],
    'name': 'delegateApprove',
    'outputs': [],
    'payable': true,
    'stateMutability': 'payable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [],
    'name': 'delegateDeposit',
    'outputs': [],
    'payable': true,
    'stateMutability': 'payable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_tokenAddresses',
        'type': 'address[]',
      },
      {
        'name': '_value',
        'type': 'uint256[]',
      },
    ],
    'name': 'setup',
    'outputs': [],
    'payable': true,
    'stateMutability': 'payable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_tokenAddresses',
        'type': 'address[]',
      },
      {
        'name': '_value',
        'type': 'uint256[]',
      },
    ],
    'name': 'approveTokens',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
]

module.exports = {
  ERC20,
  WETH,
  Exchange,
  RewardPools,
  RewardCollector,
  SetupAccount,
}
