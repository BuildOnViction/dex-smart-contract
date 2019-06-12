pragma solidity ^0.5.0;

import "./Token.sol";

contract BTC is Token {
  constructor() Token("Bitcoin", "BTC", 21000000, 8) public {
  }
}
