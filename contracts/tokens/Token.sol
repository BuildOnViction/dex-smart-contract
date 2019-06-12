pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";

/// @dev this ERC20 contract is used for creating Test-Tokens only
contract Token is ERC20, ERC20Detailed, ERC20Capped {
  constructor(string memory name, string memory symbol, uint256 totalSupply, uint8 decimals)
  ERC20Detailed(name, symbol, decimals)
  ERC20Capped(totalSupply)
  ERC20()
  public {
    _mint(msg.sender, totalSupply * 10 / 100);
  }
}
