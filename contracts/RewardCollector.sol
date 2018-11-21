pragma solidity 0.4.24;

import "./utils/Owned.sol";
import "./interfaces/ERC20.sol";
import "./RewardPools.sol";

contract RewardCollector is Owned {
  address public rewardPools;

  modifier onlyRewardPools {
    require(msg.sender == rewardPools);
    _;
  }

  function () public payable
  {
    revert();
  }

  function setRewardPools(address _rewardPools) onlyOwner public
  {
    rewardPools = _rewardPools;
  }

  constructor() public
  {
  }

  function transferTokensToPool(address _tokenAddress, uint256 _value) onlyRewardPools public
  {
    require(ERC20(_tokenAddress).transfer(rewardPools, _value));
  }
}