pragma solidity ^0.5.0;

import "./Token.sol";

contract TOMOS is Token {
  constructor() Token("Tomo USD", "TOMOS", 1000000000, 18) public {
  }
}
