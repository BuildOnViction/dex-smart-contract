pragma solidity 0.4.24;

import "../interfaces/ERC20.sol";
import "./WETH.sol";

contract SetupAccount {

    address public exchangeAddress;
    address public wethAddress;

    constructor (
        address _exchangeAddress,
        address _wethAddress
    ) public {
        exchangeAddress = _exchangeAddress;
        wethAddress = _wethAddress;
    }

    function delegateApprove(
        address _tokenAddress,
        uint256 _value
    ) public payable {
        _tokenAddress.delegatecall(bytes4(keccak256("approve(address, uint256)")), _tokenAddress, _value);
    }

    function delegateDeposit(
    ) public payable {
        wethAddress.delegatecall(bytes4(keccak256("deposit()")));
    }

    //The setup account function sets up the account of a trader by carrying out the following actions:
    //1) approve the tokens that the trader wishes to trades
    //2) deposit ETH into WETH if the trader wants to trade WETH.
    function setup(
        address[] _tokenAddresses,
        uint256[] _value
    ) public payable {
        for (uint i = 0; i < _tokenAddresses.length; i++) {
            delegateApprove(_tokenAddresses[i], _value[i]);
        }

        if (msg.value != 0) {
            delegateDeposit();
        }
    }

    function approveTokens(
        address[] _tokenAddresses,
        address[] _spenders,
        uint256[] _value
    ) public {
        for (uint i = 0; i < _tokenAddresses.length; i++) {
            ERC20(_tokenAddresses[i]).approve(_spenders[i], _value[i]);
        }
    }
}
