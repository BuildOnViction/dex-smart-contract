pragma solidity 0.4.24;

import "./utils/SafeMath.sol";
import "./utils/Owned.sol";
import "./interfaces/ERC20.sol";

contract Exchange is Owned {
  using SafeMath for uint256;

  enum Errors {
      SIGNATURE_INVALID,                      // Signature is invalid
      MAKER_SIGNATURE_INVALID,                // Maker signature is invalid
      TAKER_SIGNATURE_INVALID,                // Taker signature is invalid
      SIDES_INVALID,
      PRICE_INVALID,
      ORDER_EXPIRED,                          // Order has already expired
      TRADE_ALREADY_COMPLETED_OR_CANCELLED,   // Trade has already been completed or it has been cancelled by taker
      TRADE_AMOUNT_TOO_BIG,                   // Trade buyToken amount bigger than the remianing amountBuy
      ROUNDING_ERROR_TOO_LARGE                // Rounding error too large
  }

  string constant public VERSION = "1.0.0";
  address public rewardAccount;
  mapping(address => bool) public operators;
  mapping(bytes32 => uint) public filled;       // Mappings of orderHash => amount of amountBuy filled.
  // mapping(bytes32 => bool) public traded;       // Mappings of tradeHash => bool value representing whether the trade is completed(true) or incomplete(false).
  mapping(bytes32 => Pair) public pairs;

  event LogRewardAccountUpdate(address oldRewardAccount, address newRewardAccount);
  event LogOperatorUpdate(address operator, bool isOperator);

  event LogBatchTrades(
    bytes32[] makerOrderHashes,
    bytes32[] takerOrderHashes,
    bytes32 indexed tokenPairHash
  );

  event LogTrade(
      address indexed maker,
      address indexed taker,
      address tokenSell,
      address tokenBuy,
      uint256 filledAmountSell,
      uint256 filledAmountBuy,
      uint paidFeeMake,
      uint paidFeeTake,
      bytes32 orderHash,
      bytes32 tradeHash,
      bytes32 indexed tokenPairHash // keccak256(makerToken, takerToken), allows subscribing to a token pair
  );

  event LogError(
      uint8 errorId,
      bytes32 makerOrderHash,
      bytes32 takerOrderHash
  );

  event LogCancelOrder(
      bytes32 orderHash,
      address userAddress,
      address baseToken,
      address quoteToken,
      uint256 amount,
      uint256 pricepoint,
      uint256 side
  );

  struct Pair {
    bytes32 pairID;
    address baseToken;
    address quoteToken;
    uint256 pricepointMultiplier;
  }

  struct Order {
    address userAddress;
    address baseToken;
    address quoteToken;
    uint256 amount;
    uint256 pricepoint;
    uint256 side;
    uint256 salt;
    uint256 feeMake;
    uint256 feeTake;
  }

  struct Trade {
    bytes32 orderHash;  // Keccak-256 hash of the order to which the trade is linked
    uint256 amount;     // The amount of buy tokens asked in the order
    uint256 tradeNonce; // A taker wise unique incrementing integer value assigned to the trade
    address taker;      // Ethereum address of the trade taker
  }

  modifier onlyOperator {
    require(msg.sender == owner || operators[msg.sender]);
    _;
  }

  constructor(address _rewardAccount) public {
    rewardAccount = _rewardAccount;
  }

  function registerPair(address _baseToken, address _quoteToken, uint256 _pricepointMultiplier) public onlyOwner returns (bool) {
    bytes32 pairID = getPairHash(_baseToken, _quoteToken);

    pairs[pairID] = Pair({
      pairID: pairID,
      baseToken: _baseToken,
      quoteToken: _quoteToken,
      pricepointMultiplier: _pricepointMultiplier
    });
  }

  function getPairPricepointMultiplier(address _baseToken, address _quoteToken) public constant returns (uint256) {
    bytes32 pairID = getPairHash(_baseToken, _quoteToken);

    return pairs[pairID].pricepointMultiplier;
  }

  function pairIsRegistered(address _baseToken, address _quoteToken) public constant returns (bool) {
    bytes32 pairID = getPairHash(_baseToken, _quoteToken);
    if (pairs[pairID].pricepointMultiplier == 0) return false;

    return true;
  }

  /// @dev Sets the address of fees account.
  /// @param _rewardAccount An address to set as fees account.
  /// @return Success on setting fees account.
  function setFeeAccount(address _rewardAccount) public onlyOwner returns (bool) {
    require(_rewardAccount != address(0));
    emit LogRewardAccountUpdate(rewardAccount,_rewardAccount);
    rewardAccount = _rewardAccount;
    return true;
  }

  /// @dev Sets or unset's an operator.
  /// @param _operator The address of operator to set.
  /// @param _isOperator Bool value indicating whether the address is operator or not.
  /// @return Success on setting an operator.
  function setOperator(address _operator, bool _isOperator) public onlyOwner returns (bool) {
    require(_operator != address(0));
    emit LogOperatorUpdate(_operator,_isOperator);
    operators[_operator] = _isOperator;
    return true;
  }

  function executeBatchTrades(
    uint256[10][] orderValues,
    address[4][] orderAddresses,
    uint256[] amounts,
    uint8[2][] memory v,
    bytes32[4][] memory rs
  ) public onlyOperator returns (bool)
  {
    bytes32[] memory makerOrderHashes = new bytes32[](orderAddresses.length);
    bytes32[] memory takerOrderHashes = new bytes32[](orderAddresses.length);

    for (uint i = 0; i < orderAddresses.length; i++) {
      bool valid = validateSignatures(
        orderValues[i],
        orderAddresses[i],
        v[i],
        rs[i]
      );

      if (!valid) return false;

      uint256 pricepointMultiplier = validatePair(orderAddresses[i]);
      bytes32 makerOrderHash; 
      bytes32 takerOrderHash;
      bool traded;
      (makerOrderHash, takerOrderHash, traded) = executeTrade(
        orderValues[i],
        orderAddresses[i],
        amounts[i],
        pricepointMultiplier
      );

      if (traded) {
        makerOrderHashes[i] = makerOrderHash;
        takerOrderHashes[i] = takerOrderHash;
      }
    }

    payTakerFees(
      orderValues[0], //takerOrder.amount
      orderAddresses[0], //takerOrder.feeTake
      amounts
    );

    emitLog(
      orderAddresses[0],
      makerOrderHashes,
      takerOrderHashes
    );
  }



  function executeSingleTrade(
    uint256[10] orderValues,
    address[4] orderAddresses,
    uint256 amount,
    uint8[2] memory v,
    bytes32[4] memory rs
  ) public onlyOperator returns (bool)
  {
    bool valid = validateSignatures(
      orderValues,
      orderAddresses,
      v,
      rs
    );

    if (!valid) return false;

    uint256 pricepointMultiplier = validatePair(orderAddresses);
    executeTrade(
      orderValues,
      orderAddresses,
      amount,
      pricepointMultiplier
    );

    paySingleTradeTakerFees(
      orderValues, //takerOrder.amount
      orderAddresses, //takerOrder.userAddress
      amount
    );
  }

  function validatePair(
    address[4] orderAddresses
  ) internal view returns (uint256) {
    bytes32 pairID = getPairHash(orderAddresses[2], orderAddresses[3]);
    Pair memory pair = pairs[pairID];

    return pair.pricepointMultiplier;
  }


  function validateSignatures(
    uint256[10] orderValues,
    address[4] orderAddresses,
    uint8[2] memory v,
    bytes32[4] memory rs
  ) public returns (bool)
  {
    Order memory makerOrder = Order({
      userAddress: orderAddresses[0],
      baseToken: orderAddresses[2],
      quoteToken: orderAddresses[3],
      amount: orderValues[0],
      pricepoint: orderValues[1],
      side: orderValues[2],
      salt: orderValues[3],
      feeMake: orderValues[8],
      feeTake: orderValues[9]
    });

    Order memory takerOrder = Order({
      userAddress: orderAddresses[1],
      baseToken: orderAddresses[2],
      quoteToken: orderAddresses[3],
      amount: orderValues[4],
      pricepoint: orderValues[5],
      side: orderValues[6],
      salt: orderValues[7],
      feeTake: orderValues[8],
      feeMake: orderValues[9]
    });

    bytes32 makerOrderHash = getOrderHash(makerOrder);
    bytes32 takerOrderHash = getOrderHash(takerOrder);

    if (!isValidSignature(makerOrder.userAddress, makerOrderHash, v[0], rs[0], rs[1])) {
      emit LogError(uint8(Errors.MAKER_SIGNATURE_INVALID), makerOrderHash, takerOrderHash);
      return false;
    }

    if (!isValidSignature(takerOrder.userAddress, takerOrderHash, v[1], rs[2], rs[3])) {
      emit LogError(uint8(Errors.TAKER_SIGNATURE_INVALID), makerOrderHash, takerOrderHash);
      return false;
    }

    return true;
  }

  /*
  * Core exchange functions
  */
  function executeTrade(
    uint256[10] orderValues,
    address[4] orderAddresses,
    uint256 amount,
    uint256 pricepointMultiplier
  ) public onlyOperator returns (bytes32, bytes32, bool)
  {
    Order memory makerOrder = Order({
      userAddress: orderAddresses[0],
      baseToken: orderAddresses[2],
      quoteToken: orderAddresses[3],
      amount: orderValues[0],
      pricepoint: orderValues[1],
      side: orderValues[2],
      salt: orderValues[3],
      feeMake: orderValues[8],
      feeTake: orderValues[9]
    });

    Order memory takerOrder = Order({
      userAddress: orderAddresses[1],
      baseToken: orderAddresses[2],
      quoteToken: orderAddresses[3],
      amount: orderValues[4],
      pricepoint: orderValues[5],
      side: orderValues[6],
      salt: orderValues[7],
      feeTake: orderValues[8],
      feeMake: orderValues[9]
    });

    bytes32 makerOrderHash = getOrderHash(makerOrder);
    bytes32 takerOrderHash = getOrderHash(takerOrder);

    if ((filled[makerOrderHash].add(amount)) > makerOrder.amount) {
      emit LogError(uint8(Errors.TRADE_AMOUNT_TOO_BIG), makerOrderHash, takerOrderHash);
      return (makerOrderHash, takerOrderHash, false);
    }

    if ((filled[takerOrderHash].add(amount)) > takerOrder.amount) {
      emit LogError(uint8(Errors.TRADE_AMOUNT_TOO_BIG), makerOrderHash, takerOrderHash);
      return (makerOrderHash, takerOrderHash, false);
    }

    //TODO force side = 0 or 1
    if (takerOrder.side == makerOrder.side) {
      emit LogError(uint8(Errors.SIDES_INVALID), makerOrderHash, takerOrderHash);
      return (makerOrderHash, takerOrderHash, false);
    }

    if (makerOrder.side == 0) { //makerOrder is a buy
      if (makerOrder.pricepoint < takerOrder.pricepoint) { //buy price < sell price
        emit LogError(uint8(Errors.PRICE_INVALID), makerOrderHash, takerOrderHash);
        return (makerOrderHash, takerOrderHash, false);
      }
    }

    if (makerOrder.side == 1) { //takerOrder is a buy
      if (takerOrder.pricepoint < makerOrder.pricepoint) {
        emit LogError(uint8(Errors.PRICE_INVALID), makerOrderHash, takerOrderHash);
        return (makerOrderHash, takerOrderHash, false);
      }
    }

    filled[takerOrderHash] = (filled[takerOrderHash].add(amount));
    filled[makerOrderHash] = (filled[makerOrderHash].add(amount));

    uint256 baseTokenAmount = amount;
    uint256 quoteTokenAmount = (amount.mul(makerOrder.pricepoint)).div(pricepointMultiplier);
    uint256 fee = getPartialAmount(amount, makerOrder.amount, makerOrder.feeMake);

    if (makerOrder.side == 0) {
      require(ERC20(makerOrder.quoteToken).transferFrom(makerOrder.userAddress, takerOrder.userAddress, quoteTokenAmount));
      require(ERC20(makerOrder.quoteToken).transferFrom(makerOrder.userAddress, rewardAccount, fee));
      require(ERC20(takerOrder.baseToken).transferFrom(takerOrder.userAddress, makerOrder.userAddress, baseTokenAmount));
    } else {
      require(ERC20(makerOrder.baseToken).transferFrom(makerOrder.userAddress, takerOrder.userAddress, baseTokenAmount));
      require(ERC20(takerOrder.quoteToken).transferFrom(takerOrder.userAddress, rewardAccount, fee));
      require(ERC20(takerOrder.quoteToken).transferFrom(takerOrder.userAddress, makerOrder.userAddress, quoteTokenAmount - fee));
    }

    return (makerOrderHash, takerOrderHash, true);
  }


  function paySingleTradeTakerFees(
    uint256[10] orderValues,
    address[4] orderAddresses,
    uint256 amount
  ) internal returns (bool)
  {
    uint256 takerOrderAmount = orderValues[4];
    uint256 feeTake = orderValues[8];
    address userAddress = orderAddresses[1];
    address quoteToken = orderAddresses[3];


    uint256 fee = getPartialAmount(amount, takerOrderAmount, feeTake);
    require(ERC20(quoteToken).transferFrom(userAddress, rewardAccount, fee));
  }


  function payTakerFees(
    uint256[10] orderValues,
    address[4] orderAddresses,
    uint256[] amounts
  ) internal returns (bool)
  {
    uint256 takerOrderAmount = orderValues[4];
    uint256 feeTake = orderValues[8];
    address userAddress = orderAddresses[1];
    address quoteToken = orderAddresses[3];

    uint256 totalAmount;
    for (uint i = 0; i < amounts.length; i++) {
      totalAmount = totalAmount + amounts[i];
    }

    uint256 fee = getPartialAmount(totalAmount, takerOrderAmount, feeTake);
    require(ERC20(quoteToken).transferFrom(userAddress, rewardAccount, fee));
  }


  function batchCancelOrders(
    uint256[6][] orderValues,
    address[3][] orderAddresses,
    uint8[] v,
    bytes32[] r,
    bytes32[] s
  ) public
  {
    for (uint i = 0; i < orderAddresses.length; i++) {
      cancelOrder(
        orderValues[i],
        orderAddresses[i],
        v[i],
        r[i],
        s[i]
      );
    }
  }

  /// @dev Cancels the input order.
  /// @param orderValues Array of order's amountBuy, amountSell, expires, nonce, feeMake & feeTake values.
  /// @param orderAddresses Array of order's tokenBuy, tokenSell & maker addresses.
  /// @param v ECDSA signature parameter v.
  /// @param r ECDSA signature parameters r.
  /// @param s ECDSA signature parameters s.
  /// @return Success or failure of order cancellation.
  function cancelOrder(
    uint256[6] orderValues,
    address[3] orderAddresses,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public returns (bool)
  {

    Order memory order = Order({
      userAddress: orderAddresses[0],
      baseToken: orderAddresses[1],
      quoteToken: orderAddresses[2],
      amount: orderValues[0],
      pricepoint: orderValues[1],
      side: orderValues[2],
      salt: orderValues[3],
      feeTake: orderValues[4],
      feeMake: orderValues[5]
    });

    bytes32 orderHash = getOrderHash(order);

    if (!isValidSignature(msg.sender, orderHash, v, r, s)) {
      emit LogError(uint8(Errors.SIGNATURE_INVALID), orderHash, "");
      return false;
    }

    filled[orderHash] = order.amount;
    emit LogCancelOrder(
      orderHash,
      order.userAddress,
      order.baseToken,
      order.quoteToken,
      order.amount,
      order.pricepoint,
      order.side
    );

    return true;
  }

  /*
  * Pure public functions
  */

  /// @dev Verifies that a signature is valid.
  /// @param signer address of signer.
  /// @param hash Signed Keccak-256 hash.
  /// @param v ECDSA signature parameter v.
  /// @param r ECDSA signature parameters r.
  /// @param s ECDSA signature parameters s.
  /// @return Validity of order signature.
  function isValidSignature(
    address signer,
    bytes32 hash,
    uint8 v,
    bytes32 r,
    bytes32 s)
  public
  pure
  returns (bool)
  {
    return signer == ecrecover(
      keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)),
      v,
      r,
      s
    );
  }

  /// @dev Checks if rounding error > 0.1%.
  /// @param numerator Numerator.
  /// @param denominator Denominator.
  /// @param target Value to multiply with numerator/denominator.
  /// @return Rounding error is present.
  function isRoundingError(uint numerator, uint denominator, uint target)
  public
  pure
  returns (bool)
  {
    uint remainder = mulmod(target, numerator, denominator);
    if (remainder == 0) return false;
    // No rounding error.

    uint errPercentageTimes1000000 = (remainder.mul(1000000)).div(numerator.mul(target));
    return errPercentageTimes1000000 > 1000;
  }

  /// @dev Calculates partial value given a numerator and denominator.
  /// @param numerator Numerator.
  /// @param denominator Denominator.
  /// @param target Value to calculate partial of.
  /// @return Partial value of target.
  function getPartialAmount(uint numerator, uint denominator, uint target)
  public
  pure
  returns (uint)
  {
    return (numerator.mul(target)).div(denominator);
  }


  /*
  *   Internal functions
  *   pure means no access to storage
  */

  function getPairHash(address _baseToken, address _quoteToken)
  internal
  pure
  returns (bytes32)
  {
    return keccak256(
      abi.encodePacked(
        _baseToken,
        _quoteToken
    ));
  }


  /// @dev Calculates Keccak-256 hash of order.
  /// @param order Order that will be hased.
  /// @return Keccak-256 hash of order.
  function getOrderHash(Order order)
  internal
  view
  returns (bytes32)
  {
    return keccak256(
      abi.encodePacked(
        address(this),
        order.userAddress,
        order.baseToken,
        order.quoteToken,
        order.amount,
        order.pricepoint,
        order.side,
        order.salt,
        order.feeMake,
        order.feeTake
    ));
  }

  function emitLog(
    address[4] orderAddresses,
    bytes32[] makerOrderHashes,
    bytes32[] takerOrderHashes
  ) public {

    emit LogBatchTrades(
      makerOrderHashes,
      takerOrderHashes,
      keccak256(abi.encodePacked(orderAddresses[1], orderAddresses[2]))
    );
  }

}

// if (isRoundingError(trade.amount, order.amountBuy, order.amountSell)) {
//             emit LogError(uint8(Errors.ROUNDING_ERROR_TOO_LARGE), orderHash, tradeHash);
//             return (orderHash, tradeHash, 0);
//         }