pragma solidity ^0.4.24;
/**
 * @title Controlled
 * @dev The Controlled contract has an controller address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Controlled
{
  address public controller;


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender account.
   */
  constructor() public
  {
    controller = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyController()
  {
    require(msg.sender == controller);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newController The address to transfer ownership to.
   */
  function transferControl(address newController) public onlyController
  {
    if (newController != address(0))
    {
      controller = newController;
    }
  }
}