pragma solidity ^0.5.0;

import "./Token.sol";

contract USDT is Token {
  constructor() Token("Tether USD", "USDT", 1000000000, 18) public {
  }
}
