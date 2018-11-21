pragma solidity 0.4.24;

contract RewardCollectorInterface
{
  function transferTokensToPool(address _tokenAddress, uint256 _value) public returns (uint256);
}