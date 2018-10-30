# Smart Contract Documentation

## Content

- [Exchange](#exchange)
  - [setOwner](#function-setowner)
  - [operators](#function-operators)
  - [isRoundingError](#function-isroundingerror)
  - [executeTrade](#function-executetrade)
  - [filled](#function-filled)
  - [cancelTrade](#function-canceltrade)
  - [setFeeAccount](#function-setfeeaccount)
  - [wethToken](#function-wethtoken)
  - [setOperator](#function-setoperator)
  - [feeAccount](#function-feeaccount)
  - [isValidSignature](#function-isvalidsignature)
  - [setWethToken](#function-setwethtoken)
  - [owner](#function-owner)
  - [getPartialAmount](#function-getpartialamount)
  - [traded](#function-traded)
  - [cancelOrder](#function-cancelorder)
  - [VERSION](#function-version)
  - [LogWethTokenUpdate](#event-logwethtokenupdate)
  - [LogFeeAccountUpdate](#event-logfeeaccountupdate)
  - [LogOperatorUpdate](#event-logoperatorupdate)
  - [LogTrade](#event-logtrade)
  - [LogError](#event-logerror)
  - [LogCancelOrder](#event-logcancelorder)
  - [LogCancelTrade](#event-logcanceltrade)
  - [SetOwner](#event-setowner)
- [ERC20](#erc20)
  - [name](#function-name)
  - [approve](#function-approve)
  - [totalSupply](#function-totalsupply)
  - [totalTokenSupply](#function-totaltokensupply)
  - [transferFrom](#function-transferfrom)
  - [decimals](#function-decimals)
  - [balanceOf](#function-balanceof)
  - [symbol](#function-symbol)
  - [transfer](#function-transfer)
  - [allowance](#function-allowance)
  - [Transfer](#event-transfer)
  - [Approval](#event-approval)
- [Owned](#owned)
  - [setOwner](#function-setowner)
  - [owner](#function-owner)
  - [SetOwner](#event-setowner)
- [SafeMath](#safemath)

# Exchange

## _function_ setOwner

Exchange.setOwner(newOwner) `nonpayable` `13af4035`

Inputs

| **type**  | **name** | **description** |
| --------- | -------- | --------------- |
| _address_ | newOwner | undefined       |

## _function_ operators

Exchange.operators() `view` `13e7c9d8`

Inputs

| **type**  | **name** | **description** |
| --------- | -------- | --------------- |
| _address_ |          | undefined       |

## _function_ isRoundingError

Exchange.isRoundingError(numerator, denominator, target) `pure` `14df96ee`

> Checks if rounding error > 0.1%.

Inputs

| **type**  | **name**    | **description**                               |
| --------- | ----------- | --------------------------------------------- |
| _uint256_ | numerator   | Numerator.                                    |
| _uint256_ | denominator | Denominator.                                  |
| _uint256_ | target      | Value to multiply with numerator/denominator. |

Outputs

| **type** | **name** | **description** |
| -------- | -------- | --------------- |
| _bool_   |          | undefined       |

## _function_ executeTrade

Exchange.executeTrade(orderValues, orderAddresses, v, rs) `nonpayable` `2207148d`

> Executes a trade between maker & taker.

Inputs

| **type**     | **name**       | **description**                                                                                                                                                                                                                                                       |
| ------------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _uint256[8]_ | orderValues    | Array of order's buyAmount, sellAmount, expires, nonce, feeMake & feeTake values.                                                                                                                                                                                     |
| _address[4]_ | orderAddresses | Array of order's buyToken, sellToken, maker & taker addresses.                                                                                                                                                                                                        |
| _uint8[2]_   | v              | Array of maker's & taker's ECDSA signature parameter v for order & trade. v[0] is v parameter of the maker's signature v[1] is v parameter of the taker's signature                                                                                                   |
| _bytes32[4]_ | rs             | Array of maker's & taker's ECDSA signature parameter r & s for order & trade. rs[0] is r parameter of the maker's signature rs[1] is s parameter of the maker's signature rs[2] is r parameter of the taker's signature rs[3] is s parameter of the taker's signature |

Outputs

| **type** | **name** | **description** |
| -------- | -------- | --------------- |
| _bool_   |          | undefined       |

## _function_ filled

Exchange.filled() `view` `288cdc91`

Inputs

| **type**  | **name** | **description** |
| --------- | -------- | --------------- |
| _bytes32_ |          | undefined       |

## _function_ cancelTrade

Exchange.cancelTrade(orderHash, amount, tradeNonce, taker, v, r, s) `nonpayable` `468ddf2e`

> Cancels the input trade.

Inputs

| **type**  | **name**   | **description**                                              |
| --------- | ---------- | ------------------------------------------------------------ |
| _bytes32_ | orderHash  | Keccak-256 hash of order.                                    |
| _uint256_ | amount     | Desired amount of takerToken that was to be filled in trade. |
| _uint256_ | tradeNonce | Trade nonce that was used in the trade.                      |
| _address_ | taker      | Address of the taker.                                        |
| _uint8_   | v          | ECDSA signature parameter v.                                 |
| _bytes32_ | r          | ECDSA signature parameters r.                                |
| _bytes32_ | s          | ECDSA signature parameters s.                                |

Outputs

| **type** | **name** | **description** |
| -------- | -------- | --------------- |
| _bool_   |          | undefined       |

## _function_ setFeeAccount

Exchange.setFeeAccount(\_feeAccount) `nonpayable` `4b023cf8`

> Sets the address of fees account.

Inputs

| **type**  | **name**     | **description**                    |
| --------- | ------------ | ---------------------------------- |
| _address_ | \_feeAccount | An address to set as fees account. |

Outputs

| **type** | **name** | **description** |
| -------- | -------- | --------------- |
| _bool_   |          | undefined       |

## _function_ wethToken

Exchange.wethToken() `view` `4b57b0be`

## _function_ setOperator

Exchange.setOperator(\_operator, \_isOperator) `nonpayable` `558a7297`

> Sets or unset's an operator.

Inputs

| **type**  | **name**     | **description**                                               |
| --------- | ------------ | ------------------------------------------------------------- |
| _address_ | \_operator   | The address of operator to set.                               |
| _bool_    | \_isOperator | Bool value indicating whether the address is operator or not. |

Outputs

| **type** | **name** | **description** |
| -------- | -------- | --------------- |
| _bool_   |          | undefined       |

## _function_ feeAccount

Exchange.feeAccount() `view` `65e17c9d`

## _function_ isValidSignature

Exchange.isValidSignature(signer, hash, v, r, s) `pure` `8163681e`

> Verifies that a signature is valid.

Inputs

| **type**  | **name** | **description**               |
| --------- | -------- | ----------------------------- |
| _address_ | signer   | address of signer.            |
| _bytes32_ | hash     | Signed Keccak-256 hash.       |
| _uint8_   | v        | ECDSA signature parameter v.  |
| _bytes32_ | r        | ECDSA signature parameters r. |
| _bytes32_ | s        | ECDSA signature parameters s. |

Outputs

| **type** | **name** | **description** |
| -------- | -------- | --------------- |
| _bool_   |          | undefined       |

## _function_ setWethToken

Exchange.setWethToken(\_wethToken) `nonpayable` `86e09c08`

> Sets the address of WETH token.

Inputs

| **type**  | **name**    | **description**                          |
| --------- | ----------- | ---------------------------------------- |
| _address_ | \_wethToken | An address to set as WETH token address. |

Outputs

| **type** | **name** | **description** |
| -------- | -------- | --------------- |
| _bool_   |          | undefined       |

## _function_ owner

Exchange.owner() `view` `8da5cb5b`

## _function_ getPartialAmount

Exchange.getPartialAmount(numerator, denominator, target) `pure` `98024a8b`

> Calculates partial value given a numerator and denominator.

Inputs

| **type**  | **name**    | **description**                |
| --------- | ----------- | ------------------------------ |
| _uint256_ | numerator   | Numerator.                     |
| _uint256_ | denominator | Denominator.                   |
| _uint256_ | target      | Value to calculate partial of. |

Outputs

| **type**  | **name** | **description** |
| --------- | -------- | --------------- |
| _uint256_ |          | undefined       |

## _function_ traded

Exchange.traded() `view` `d5813323`

Inputs

| **type**  | **name** | **description** |
| --------- | -------- | --------------- |
| _bytes32_ |          | undefined       |

## _function_ cancelOrder

Exchange.cancelOrder(orderValues, orderAddresses, v, r, s) `nonpayable` `d9a72b52`

> Cancels the input order.

Inputs

| **type**     | **name**       | **description**                                                                   |
| ------------ | -------------- | --------------------------------------------------------------------------------- |
| _uint256[6]_ | orderValues    | Array of order's buyAmount, sellAmount, expires, nonce, feeMake & feeTake values. |
| _address[3]_ | orderAddresses | Array of order's buyToken, sellToken & maker addresses.                           |
| _uint8_      | v              | ECDSA signature parameter v.                                                      |
| _bytes32_    | r              | ECDSA signature parameters r.                                                     |
| _bytes32_    | s              | ECDSA signature parameters s.                                                     |

Outputs

| **type** | **name** | **description** |
| -------- | -------- | --------------- |
| _bool_   |          | undefined       |

## _function_ VERSION

Exchange.VERSION() `view` `ffa1ad74`

## _event_ LogWethTokenUpdate

Exchange.LogWethTokenUpdate(oldWethToken, newWethToken) `b8be72b4`

Arguments

| **type**  | **name**     | **description** |
| --------- | ------------ | --------------- |
| _address_ | oldWethToken | not indexed     |
| _address_ | newWethToken | not indexed     |

## _event_ LogFeeAccountUpdate

Exchange.LogFeeAccountUpdate(oldFeeAccount, newFeeAccount) `f822f5a1`

Arguments

| **type**  | **name**      | **description** |
| --------- | ------------- | --------------- |
| _address_ | oldFeeAccount | not indexed     |
| _address_ | newFeeAccount | not indexed     |

## _event_ LogOperatorUpdate

Exchange.LogOperatorUpdate(operator, isOperator) `4af650e9`

Arguments

| **type**  | **name**   | **description** |
| --------- | ---------- | --------------- |
| _address_ | operator   | not indexed     |
| _bool_    | isOperator | not indexed     |

## _event_ LogTrade

Exchange.LogTrade(maker, taker, sellToken, buyToken, filledSellAmount, filledBuyAmount, paidFeeMake, paidFeeTake, orderHash, tokenPairHash) `b4a2621e`

Arguments

| **type**  | **name**         | **description** |
| --------- | ---------------- | --------------- |
| _address_ | maker            | indexed         |
| _address_ | taker            | indexed         |
| _address_ | sellToken        | not indexed     |
| _address_ | buyToken         | not indexed     |
| _uint256_ | filledSellAmount | not indexed     |
| _uint256_ | filledBuyAmount  | not indexed     |
| _uint256_ | paidFeeMake      | not indexed     |
| _uint256_ | paidFeeTake      | not indexed     |
| _bytes32_ | orderHash        | not indexed     |
| _bytes32_ | tokenPairHash    | indexed         |

## _event_ LogError

Exchange.LogError(errorId, orderHash) `36d86c59`

Arguments

| **type**  | **name**  | **description** |
| --------- | --------- | --------------- |
| _uint8_   | errorId   | not indexed     |
| _bytes32_ | orderHash | not indexed     |

## _event_ LogCancelOrder

Exchange.LogCancelOrder(orderHash, buyToken, buyAmount, sellToken, sellAmount, expires, nonce, maker, tokenPairHash) `bfa78175`

Arguments

| **type**  | **name**      | **description** |
| --------- | ------------- | --------------- |
| _bytes32_ | orderHash     | not indexed     |
| _address_ | buyToken      | not indexed     |
| _uint256_ | buyAmount     | not indexed     |
| _address_ | sellToken     | not indexed     |
| _uint256_ | sellAmount    | not indexed     |
| _uint256_ | expires       | not indexed     |
| _uint256_ | nonce         | not indexed     |
| _address_ | maker         | indexed         |
| _bytes32_ | tokenPairHash | indexed         |

## _event_ LogCancelTrade

Exchange.LogCancelTrade(orderHash, amount, tradeNonce, taker) `1debd637`

Arguments

| **type**  | **name**   | **description** |
| --------- | ---------- | --------------- |
| _bytes32_ | orderHash  | not indexed     |
| _uint256_ | amount     | not indexed     |
| _uint256_ | tradeNonce | not indexed     |
| _address_ | taker      | indexed         |

## _event_ SetOwner

Exchange.SetOwner(previousOwner, newOwner) `cbf98511`

Arguments

| **type**  | **name**      | **description** |
| --------- | ------------- | --------------- |
| _address_ | previousOwner | indexed         |
| _address_ | newOwner      | indexed         |

---

# ERC20

## _function_ name

ERC20.name() `view` `06fdde03`

## _function_ approve

ERC20.approve(\_spender, \_value) `nonpayable` `095ea7b3`

Inputs

| **type**  | **name**  | **description** |
| --------- | --------- | --------------- |
| _address_ | \_spender | undefined       |
| _uint256_ | \_value   | undefined       |

## _function_ totalSupply

ERC20.totalSupply() `view` `18160ddd`

## _function_ totalTokenSupply

ERC20.totalTokenSupply() `view` `1ca8b6cb`

## _function_ transferFrom

ERC20.transferFrom(\_from, \_to, \_value) `nonpayable` `23b872dd`

Inputs

| **type**  | **name** | **description** |
| --------- | -------- | --------------- |
| _address_ | \_from   | undefined       |
| _address_ | \_to     | undefined       |
| _uint256_ | \_value  | undefined       |

## _function_ decimals

ERC20.decimals() `view` `313ce567`

## _function_ balanceOf

ERC20.balanceOf(\_owner) `view` `70a08231`

Inputs

| **type**  | **name** | **description** |
| --------- | -------- | --------------- |
| _address_ | \_owner  | undefined       |

## _function_ symbol

ERC20.symbol() `view` `95d89b41`

## _function_ transfer

ERC20.transfer(\_to, \_value) `nonpayable` `a9059cbb`

Inputs

| **type**  | **name** | **description** |
| --------- | -------- | --------------- |
| _address_ | \_to     | undefined       |
| _uint256_ | \_value  | undefined       |

## _function_ allowance

ERC20.allowance(\_owner, \_spender) `view` `dd62ed3e`

Inputs

| **type**  | **name**  | **description** |
| --------- | --------- | --------------- |
| _address_ | \_owner   | undefined       |
| _address_ | \_spender | undefined       |

## _event_ Transfer

ERC20.Transfer(\_from, \_to, \_value) `ddf252ad`

Arguments

| **type**  | **name** | **description** |
| --------- | -------- | --------------- |
| _address_ | \_from   | indexed         |
| _address_ | \_to     | indexed         |
| _uint256_ | \_value  | not indexed     |

## _event_ Approval

ERC20.Approval(\_owner, \_spender, \_value) `8c5be1e5`

Arguments

| **type**  | **name**  | **description** |
| --------- | --------- | --------------- |
| _address_ | \_owner   | indexed         |
| _address_ | \_spender | indexed         |
| _uint256_ | \_value   | not indexed     |

---

# Owned

## _function_ setOwner

Owned.setOwner(newOwner) `nonpayable` `13af4035`

Inputs

| **type**  | **name** | **description** |
| --------- | -------- | --------------- |
| _address_ | newOwner | undefined       |

## _function_ owner

Owned.owner() `view` `8da5cb5b`

## _event_ SetOwner

Owned.SetOwner(previousOwner, newOwner) `cbf98511`

Arguments

| **type**  | **name**      | **description** |
| --------- | ------------- | --------------- |
| _address_ | previousOwner | indexed         |
| _address_ | newOwner      | indexed         |

---

# SafeMath

---
