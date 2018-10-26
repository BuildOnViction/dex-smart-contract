# Smart Contract Documentation

## Content

* [Exchange](#exchange)
  * [setOwner](#function-setowner)
  * [operators](#function-operators)
  * [isRoundingError](#function-isroundingerror)
  * [executeTrade](#function-executetrade)
  * [filled](#function-filled)
  * [cancelTrade](#function-canceltrade)
  * [setFeeAccount](#function-setfeeaccount)
  * [wethToken](#function-wethtoken)
  * [setOperator](#function-setoperator)
  * [feeAccount](#function-feeaccount)
  * [isValidSignature](#function-isvalidsignature)
  * [setWethToken](#function-setwethtoken)
  * [owner](#function-owner)
  * [getPartialAmount](#function-getpartialamount)
  * [traded](#function-traded)
  * [cancelOrder](#function-cancelorder)
  * [VERSION](#function-version)
  * [LogWethTokenUpdate](#event-logwethtokenupdate)
  * [LogFeeAccountUpdate](#event-logfeeaccountupdate)
  * [LogOperatorUpdate](#event-logoperatorupdate)
  * [LogTrade](#event-logtrade)
  * [LogError](#event-logerror)
  * [LogCancelOrder](#event-logcancelorder)
  * [LogCancelTrade](#event-logcanceltrade)
  * [SetOwner](#event-setowner)
* [ERC20](#erc20)
  * [name](#function-name)
  * [approve](#function-approve)
  * [totalSupply](#function-totalsupply)
  * [totalTokenSupply](#function-totaltokensupply)
  * [transferFrom](#function-transferfrom)
  * [decimals](#function-decimals)
  * [balanceOf](#function-balanceof)
  * [symbol](#function-symbol)
  * [transfer](#function-transfer)
  * [allowance](#function-allowance)
  * [Transfer](#event-transfer)
  * [Approval](#event-approval)
* [Owned](#owned)
  * [setOwner](#function-setowner)
  * [owner](#function-owner)
  * [SetOwner](#event-setowner)
* [SafeMath](#safemath)

# Exchange


## *function* setOwner

Exchange.setOwner(newOwner) `nonpayable` `13af4035`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | undefined |


## *function* operators

Exchange.operators() `view` `13e7c9d8`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* isRoundingError

Exchange.isRoundingError(numerator, denominator, target) `pure` `14df96ee`

> Checks if rounding error > 0.1%.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | numerator | Numerator. |
| *uint256* | denominator | Denominator. |
| *uint256* | target | Value to multiply with numerator/denominator. |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* |  | undefined |

## *function* executeTrade

Exchange.executeTrade(orderValues, orderAddresses, v, rs) `nonpayable` `2207148d`

> Executes a trade between maker & taker.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256[8]* | orderValues | Array of order's amountBuy, amountSell, expires, nonce, feeMake & feeTake values. |
| *address[4]* | orderAddresses | Array of order's tokenBuy, tokenSell, maker & taker addresses. |
| *uint8[2]* | v | Array of maker's & taker's ECDSA signature parameter v for order & trade.         v[0] is v parameter of the maker's signature         v[1] is v parameter of the taker's signature |
| *bytes32[4]* | rs | Array of maker's & taker's ECDSA signature parameter r & s for order & trade.         rs[0] is r parameter of the maker's signature         rs[1] is s parameter of the maker's signature         rs[2] is r parameter of the taker's signature         rs[3] is s parameter of the taker's signature |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* |  | undefined |

## *function* filled

Exchange.filled() `view` `288cdc91`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* |  | undefined |


## *function* cancelTrade

Exchange.cancelTrade(orderHash, amount, tradeNonce, taker, v, r, s) `nonpayable` `468ddf2e`

> Cancels the input trade.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orderHash | Keccak-256 hash of order. |
| *uint256* | amount | Desired amount of takerToken that was to be filled in trade. |
| *uint256* | tradeNonce | Trade nonce that was used in the trade. |
| *address* | taker | Address of the taker. |
| *uint8* | v | ECDSA signature parameter v. |
| *bytes32* | r | ECDSA signature parameters r. |
| *bytes32* | s | ECDSA signature parameters s. |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* |  | undefined |

## *function* setFeeAccount

Exchange.setFeeAccount(_feeAccount) `nonpayable` `4b023cf8`

> Sets the address of fees account.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _feeAccount | An address to set as fees account. |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* |  | undefined |

## *function* wethToken

Exchange.wethToken() `view` `4b57b0be`





## *function* setOperator

Exchange.setOperator(_operator, _isOperator) `nonpayable` `558a7297`

> Sets or unset's an operator.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _operator | The address of operator to set. |
| *bool* | _isOperator | Bool value indicating whether the address is operator or not. |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* |  | undefined |

## *function* feeAccount

Exchange.feeAccount() `view` `65e17c9d`





## *function* isValidSignature

Exchange.isValidSignature(signer, hash, v, r, s) `pure` `8163681e`

> Verifies that a signature is valid.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | signer | address of signer. |
| *bytes32* | hash | Signed Keccak-256 hash. |
| *uint8* | v | ECDSA signature parameter v. |
| *bytes32* | r | ECDSA signature parameters r. |
| *bytes32* | s | ECDSA signature parameters s. |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* |  | undefined |

## *function* setWethToken

Exchange.setWethToken(_wethToken) `nonpayable` `86e09c08`

> Sets the address of WETH token.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _wethToken | An address to set as WETH token address. |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* |  | undefined |

## *function* owner

Exchange.owner() `view` `8da5cb5b`





## *function* getPartialAmount

Exchange.getPartialAmount(numerator, denominator, target) `pure` `98024a8b`

> Calculates partial value given a numerator and denominator.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | numerator | Numerator. |
| *uint256* | denominator | Denominator. |
| *uint256* | target | Value to calculate partial of. |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* traded

Exchange.traded() `view` `d5813323`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* |  | undefined |


## *function* cancelOrder

Exchange.cancelOrder(orderValues, orderAddresses, v, r, s) `nonpayable` `d9a72b52`

> Cancels the input order.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256[6]* | orderValues | Array of order's amountBuy, amountSell, expires, nonce, feeMake & feeTake values. |
| *address[3]* | orderAddresses | Array of order's tokenBuy, tokenSell & maker addresses. |
| *uint8* | v | ECDSA signature parameter v. |
| *bytes32* | r | ECDSA signature parameters r. |
| *bytes32* | s | ECDSA signature parameters s. |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* |  | undefined |

## *function* VERSION

Exchange.VERSION() `view` `ffa1ad74`





## *event* LogWethTokenUpdate

Exchange.LogWethTokenUpdate(oldWethToken, newWethToken) `b8be72b4`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | oldWethToken | not indexed |
| *address* | newWethToken | not indexed |

## *event* LogFeeAccountUpdate

Exchange.LogFeeAccountUpdate(oldFeeAccount, newFeeAccount) `f822f5a1`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | oldFeeAccount | not indexed |
| *address* | newFeeAccount | not indexed |

## *event* LogOperatorUpdate

Exchange.LogOperatorUpdate(operator, isOperator) `4af650e9`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | operator | not indexed |
| *bool* | isOperator | not indexed |

## *event* LogTrade

Exchange.LogTrade(maker, taker, tokenSell, tokenBuy, filledAmountSell, filledAmountBuy, paidFeeMake, paidFeeTake, orderHash, tokenPairHash) `b4a2621e`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | maker | indexed |
| *address* | taker | indexed |
| *address* | tokenSell | not indexed |
| *address* | tokenBuy | not indexed |
| *uint256* | filledAmountSell | not indexed |
| *uint256* | filledAmountBuy | not indexed |
| *uint256* | paidFeeMake | not indexed |
| *uint256* | paidFeeTake | not indexed |
| *bytes32* | orderHash | not indexed |
| *bytes32* | tokenPairHash | indexed |

## *event* LogError

Exchange.LogError(errorId, orderHash) `36d86c59`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *uint8* | errorId | not indexed |
| *bytes32* | orderHash | not indexed |

## *event* LogCancelOrder

Exchange.LogCancelOrder(orderHash, tokenBuy, amountBuy, tokenSell, amountSell, expires, nonce, maker, tokenPairHash) `bfa78175`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orderHash | not indexed |
| *address* | tokenBuy | not indexed |
| *uint256* | amountBuy | not indexed |
| *address* | tokenSell | not indexed |
| *uint256* | amountSell | not indexed |
| *uint256* | expires | not indexed |
| *uint256* | nonce | not indexed |
| *address* | maker | indexed |
| *bytes32* | tokenPairHash | indexed |

## *event* LogCancelTrade

Exchange.LogCancelTrade(orderHash, amount, tradeNonce, taker) `1debd637`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orderHash | not indexed |
| *uint256* | amount | not indexed |
| *uint256* | tradeNonce | not indexed |
| *address* | taker | indexed |

## *event* SetOwner

Exchange.SetOwner(previousOwner, newOwner) `cbf98511`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
# ERC20


## *function* name

ERC20.name() `view` `06fdde03`





## *function* approve

ERC20.approve(_spender, _value) `nonpayable` `095ea7b3`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _spender | undefined |
| *uint256* | _value | undefined |


## *function* totalSupply

ERC20.totalSupply() `view` `18160ddd`





## *function* totalTokenSupply

ERC20.totalTokenSupply() `view` `1ca8b6cb`





## *function* transferFrom

ERC20.transferFrom(_from, _to, _value) `nonpayable` `23b872dd`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _from | undefined |
| *address* | _to | undefined |
| *uint256* | _value | undefined |


## *function* decimals

ERC20.decimals() `view` `313ce567`





## *function* balanceOf

ERC20.balanceOf(_owner) `view` `70a08231`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _owner | undefined |


## *function* symbol

ERC20.symbol() `view` `95d89b41`





## *function* transfer

ERC20.transfer(_to, _value) `nonpayable` `a9059cbb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _to | undefined |
| *uint256* | _value | undefined |


## *function* allowance

ERC20.allowance(_owner, _spender) `view` `dd62ed3e`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _owner | undefined |
| *address* | _spender | undefined |

## *event* Transfer

ERC20.Transfer(_from, _to, _value) `ddf252ad`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | _from | indexed |
| *address* | _to | indexed |
| *uint256* | _value | not indexed |

## *event* Approval

ERC20.Approval(_owner, _spender, _value) `8c5be1e5`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | _owner | indexed |
| *address* | _spender | indexed |
| *uint256* | _value | not indexed |


---
# Owned


## *function* setOwner

Owned.setOwner(newOwner) `nonpayable` `13af4035`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | undefined |


## *function* owner

Owned.owner() `view` `8da5cb5b`





## *event* SetOwner

Owned.SetOwner(previousOwner, newOwner) `cbf98511`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
# SafeMath


---