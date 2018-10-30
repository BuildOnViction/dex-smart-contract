pragma solidity ^0.4.21;
// version 0.4.21 support emit and contructor

import "./utils/SafeMath.sol";
import "./utils/Owned.sol";
import "./interfaces/ERC20.sol";

contract Exchange is Owned {
    using SafeMath for uint256;

    enum Errors {
        SIGNATURE_INVALID,                      // Signature is invalid
        MAKER_SIGNATURE_INVALID,                // Maker signature is invalid
        TAKER_SIGNATURE_INVALID,                // Taker signature is invalid
        ORDER_EXPIRED,                          // Order has already expired
        TRADE_ALREADY_COMPLETED_OR_CANCELLED,   // Trade has already been completed or it has been cancelled by taker
        TRADE_AMOUNT_TOO_BIG,                   // Trade buyToken amount bigger than the remianing buyAmount
        ROUNDING_ERROR_TOO_LARGE                // Rounding error too large
    }

    string constant public VERSION = "1.0.0";

    address public wethToken;
    address public feeAccount;
    mapping(address => bool) public operators;
    mapping(bytes32 => uint) public filled;       // Mappings of orderHash => amount of buyAmount filled.
    mapping(bytes32 => bool) public traded;       // Mappings of tradeHash => bool value representing whether the trade is completed(true) or incomplete(false).

    event LogWethTokenUpdate(address oldWethToken, address newWethToken);
    event LogFeeAccountUpdate(address oldFeeAccount, address newFeeAccount);
    event LogOperatorUpdate(address operator, bool isOperator);

    event LogTrade(
        address indexed maker,
        address indexed taker,
        address sellToken,
        address buyToken,
        uint256 filledSellAmount,
        uint256 filledBuyAmount,
        uint paidFeeMake,
        uint paidFeeTake,
        bytes32 orderHash,
        bytes32 tradeHash,
        bytes32 indexed tokenPairHash // keccak256(makerToken, takerToken), allows subscribing to a token pair
    );

    event LogError(
        uint8 errorId,
        bytes32 orderHash,
        bytes32 tradeHash
    );

    event LogCancelOrder(
        bytes32 orderHash,
        address buyToken,
        uint256 buyAmount,
        address sellToken,
        uint256 sellAmount,
        uint256 expires,
        uint256 nonce,
        address indexed maker,
        bytes32 indexed tokenPairHash // keccak256(makerToken, takerToken), allows subscribing to a token pair
    );

    event LogCancelTrade(
        bytes32 orderHash,
        uint256 amount,
        uint256 tradeNonce,
        address indexed taker
    );

    struct Order {
        uint256 buyAmount;  // The amount of buy tokens asked in the order
        uint256 sellAmount; // The amount of sell tokens asked in the order
        uint256 expires;    // The block length after which the order will be considered expired
        uint256 nonce;      // A maker wise unique incrementing integer value assigned to the order
        uint256 feeMake;    // It is the maker fee
        uint256 feeTake;    // It is the taker fee
        address buyToken;   // Ethereum address of the buy token
        address sellToken;  // Ethereum address of the sell token
        address maker;      // Ethereum address of the order maker
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

    constructor(address _wethToken, address _feeAccount) public {
        wethToken = _wethToken;
        feeAccount = _feeAccount;
    }

    /// @dev Sets the address of WETH token.
    /// @param _wethToken An address to set as WETH token address.
    /// @return Success on setting WETH token address.
    function setWethToken(address _wethToken) public onlyOwner returns (bool) {
        emit LogWethTokenUpdate(wethToken,_wethToken);
        wethToken = _wethToken;
        return true;
    }

    /// @dev Sets the address of fees account.
    /// @param _feeAccount An address to set as fees account.
    /// @return Success on setting fees account.
    function setFeeAccount(address _feeAccount) public onlyOwner returns (bool) {
        require(_feeAccount != address(0));
        emit LogFeeAccountUpdate(feeAccount,_feeAccount);
        feeAccount = _feeAccount;
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


    /*
    * Core exchange functions
    */


    /// @dev Executes a trade between maker & taker.
    /// @param orderValues Array of order's buyAmount, sellAmount, expires, nonce, feeMake & feeTake values.
    /// @param orderAddresses Array of order's buyToken, sellToken, maker & taker addresses.
    /// @param v Array of maker's & taker's ECDSA signature parameter v for order & trade.
    ///         v[0] is v parameter of the maker's signature
    ///         v[1] is v parameter of the taker's signature
    /// @param rs Array of maker's & taker's ECDSA signature parameter r & s for order & trade.
    ///         rs[0] is r parameter of the maker's signature
    ///         rs[1] is s parameter of the maker's signature
    ///         rs[2] is r parameter of the taker's signature
    ///         rs[3] is s parameter of the taker's signature
    /// @return Success or failure of trade execution.
    function executeTrade(
        uint256[8] orderValues,
        address[4] orderAddresses,
        uint8[2] memory v,
        bytes32[4] memory rs
    ) public onlyOperator returns (bool)
    {
        Order memory order = Order({
            buyAmount : orderValues[0],
            sellAmount : orderValues[1],
            expires : orderValues[2],
            nonce : orderValues[3],
            feeMake : orderValues[4],
            feeTake : orderValues[5],
            buyToken : orderAddresses[0],
            sellToken : orderAddresses[1],
            maker : orderAddresses[2]
            });

        bytes32 orderHash = getOrderHash(order);

        Trade memory trade = Trade({
            orderHash : orderHash,
            amount : orderValues[6],
            tradeNonce : orderValues[7],
            taker : orderAddresses[3]
            });

        bytes32 tradeHash = getTradeHash(trade);

        if (!isValidSignature(order.maker, orderHash, v[0], rs[0], rs[1])) {
            emit LogError(uint8(Errors.MAKER_SIGNATURE_INVALID), orderHash, tradeHash);
            return false;
        }

        if (!isValidSignature(trade.taker, tradeHash, v[1], rs[2], rs[3])) {
            emit LogError(uint8(Errors.TAKER_SIGNATURE_INVALID), orderHash, tradeHash);
            return false;
        }

        if (order.expires < block.number) {
            emit LogError(uint8(Errors.ORDER_EXPIRED), orderHash, tradeHash);
            return false;
        }

        if (traded[tradeHash]) {
            emit LogError(uint8(Errors.TRADE_ALREADY_COMPLETED_OR_CANCELLED), orderHash, tradeHash);
            return false;
        }

        if (filled[orderHash].add(trade.amount) > order.buyAmount) {
            emit LogError(uint8(Errors.TRADE_AMOUNT_TOO_BIG), orderHash, tradeHash);
            return false;
        }

        if (isRoundingError(trade.amount, order.buyAmount, order.sellAmount)) {
            emit LogError(uint8(Errors.ROUNDING_ERROR_TOO_LARGE), orderHash, tradeHash);
            return false;
        }

        traded[tradeHash] = true;
        uint filledSellAmount = getPartialAmount(trade.amount, order.buyAmount, order.sellAmount);

        filled[orderHash] = filled[orderHash].add(trade.amount);

        require(ERC20(order.sellToken).transferFrom(order.maker, trade.taker, filledSellAmount));
        require(ERC20(order.buyToken).transferFrom(trade.taker, order.maker, trade.amount));

        if (order.feeMake > 0) {
            uint paidFeeMake = getPartialAmount(trade.amount, order.buyAmount, order.feeMake);
            require(ERC20(wethToken).transferFrom(order.maker, feeAccount, paidFeeMake));
        }

        if (order.feeTake > 0) {
            uint paidFeeTake = getPartialAmount(trade.amount, order.buyAmount, order.feeTake);
            require(ERC20(wethToken).transferFrom(trade.taker, feeAccount, paidFeeTake));
        }

        emit LogTrade(
            order.maker,
            trade.taker,
            order.sellToken,
            order.buyToken,
            filledSellAmount,
            trade.amount,
            paidFeeMake,
            paidFeeTake,
            orderHash,
            tradeHash,
            keccak256(abi.encodePacked(order.sellToken, order.buyToken)));
        return true;
    }

    /// @dev Cancels the input order.
    /// @param orderValues Array of order's buyAmount, sellAmount, expires, nonce, feeMake & feeTake values.
    /// @param orderAddresses Array of order's buyToken, sellToken & maker addresses.
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
            buyAmount : orderValues[0],
            sellAmount : orderValues[1],
            expires : orderValues[2],
            nonce : orderValues[3],
            feeMake : orderValues[4],
            feeTake : orderValues[5],
            buyToken : orderAddresses[0],
            sellToken : orderAddresses[1],
            maker : orderAddresses[2]
            });

        bytes32 orderHash = getOrderHash(order);

        if (!isValidSignature(msg.sender, orderHash, v, r, s)) {
            emit LogError(uint8(Errors.SIGNATURE_INVALID), orderHash, "");
            return false;
        }
        filled[orderHash] = order.buyAmount;

        emit LogCancelOrder(
            orderHash,
            order.buyToken,
            order.buyAmount,
            order.sellToken,
            order.sellAmount,
            order.expires,
            order.nonce,
            order.maker,
            keccak256(abi.encodePacked(order.sellToken, order.buyToken)));
        return true;
    }


    /// @dev Cancels the input trade.
    /// @param orderHash Keccak-256 hash of order.
    /// @param amount Desired amount of takerToken that was to be filled in trade.
    /// @param taker Address of the taker.
    /// @param tradeNonce Trade nonce that was used in the trade.
    /// @param v ECDSA signature parameter v.
    /// @param r ECDSA signature parameters r.
    /// @param s ECDSA signature parameters s.
    /// @return Success or failure of trade cancellation.
    function cancelTrade(
        bytes32 orderHash,
        uint256 amount,
        uint256 tradeNonce,
        address taker,
        uint8 v,
        bytes32 r,
        bytes32 s)
    public
    returns (bool)
    {
        Trade memory trade = Trade({
            orderHash : orderHash,
            amount : amount,
            tradeNonce : tradeNonce,
            taker : taker
            });

        bytes32 tradeHash = getTradeHash(trade);

        if (!isValidSignature(msg.sender, tradeHash, v, r, s)) {
            emit LogError(uint8(Errors.SIGNATURE_INVALID), "", tradeHash);
            return false;
        }
        traded[tradeHash] = true;

        emit LogCancelTrade(orderHash, amount, tradeNonce, taker);
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
    */


    /// @dev Calculates Keccak-256 hash of order.
    /// @param order Order that will be hased.
    /// @return Keccak-256 hash of order.
    function getOrderHash(Order order)
    internal
    view
    returns (bytes32)
    {
        return keccak256(abi.encodePacked(
                address(this),
                order.maker,
                order.sellToken,
                order.buyToken,
                order.sellAmount,
                order.buyAmount,
                order.feeMake,
                order.feeTake,
                order.expires,
                order.nonce
            ));
    }

    /// @dev Calculates Keccak-256 hash of trade.
    /// @param trade Trade that will be hashed.
    /// @return Keccak-256 hash of trade.
    function getTradeHash(Trade trade)
    internal
    pure
    returns (bytes32)
    {
        return keccak256(abi.encodePacked(
                trade.orderHash,
                trade.taker,
                trade.amount,
                trade.tradeNonce
            ));
    }

}