pragma solidity ^0.5.0;

import "./Token.sol";

contract ETH is Token {
  constructor() Token("Ethereum", "ETH", 1000000000, 18) public {
  }
}
