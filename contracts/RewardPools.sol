pragma solidity 0.4.24;

import "./utils/SafeMath.sol";
import "./utils/Owned.sol";
import "./interfaces/RELA.sol";
import "./interfaces/ERC20.sol";
import "./RewardCollector.sol";


contract RewardPools is Owned {

  using SafeMath for uint256;
  RELAInterface public tomoToken;

  address public rewardCollector;

  uint256 public blocksPerEpoch;
  uint256 public creationBlockNumber;
  uint256 public currentEpoch;
  uint256 public currentPoolIndex;
  uint256 public currentPoolBalance;

  mapping(uint256 => mapping(address => uint256)) public poolBalances;
  mapping(address => uint256) public withdrawals;

  mapping(address => bool) public quotes;
  address[] public quoteTokenList;


  constructor(address _PRFTAddress, address _rewardCollector) public
  {
    creationBlockNumber = block.number;
    blocksPerEpoch = 20;
    tomoToken = RELAInterface(_PRFTAddress);
    rewardCollector = _rewardCollector;
  }

  function () public payable
  {
    revert();
  }

  function totalUserReward(address _accountAddress, address _tokenAddress) public view returns (uint256) {
    uint256 lastEpoch = currentEpoch;
    uint256 computedEpoch = computeCurrentEpoch();
    uint256 lastWithdrawal = withdrawals[_accountAddress];
    uint256 totalReward;
    uint256 newPoolBalance;
    uint256 blockNumberAtEpochStart;
    uint256 balanceAtEpochStart;
    uint256 totalSupply;
    uint256 currentPoolReward;

    if (computedEpoch != lastEpoch) {
      newPoolBalance = ERC20(_tokenAddress).balanceOf(rewardCollector);
    } else {
      newPoolBalance = 0;
    }

    for (uint256 j = lastWithdrawal; j <= computedEpoch - 1; j++)
    {
      blockNumberAtEpochStart = getBlockNumberAtEpochStart(j);
      balanceAtEpochStart = tomoToken.balanceOfAt(_accountAddress, blockNumberAtEpochStart);
      totalSupply = tomoToken.totalSupply();
      currentPoolReward = (poolBalances[j][_tokenAddress] * balanceAtEpochStart) / totalSupply;
      totalReward = totalReward + currentPoolReward;
    }

    if (computedEpoch != lastEpoch) {
      newPoolBalance = ERC20(_tokenAddress).balanceOf(rewardCollector);
      blockNumberAtEpochStart = getBlockNumberAtEpochStart(computedEpoch);
      totalSupply = tomoToken.totalSupply();
      balanceAtEpochStart = tomoToken.balanceOfAt(_accountAddress, blockNumberAtEpochStart);
      currentPoolReward = (newPoolBalance * balanceAtEpochStart) / totalSupply;
      totalReward = totalReward + currentPoolReward;
    }

    return totalReward;
  }

  function balanceOfPool(uint256 _poolEpoch, address _tokenAddress) public view returns (uint256) {
    return poolBalances[_poolEpoch][_tokenAddress];
  }

  function removeQuoteToken(address _tokenAddress) public {
    uint i = 0;
    while (quoteTokenList[i] != _tokenAddress) {
      i++;
    }

    while (i<quoteTokenList.length-1) {
      quoteTokenList[i] = quoteTokenList[i+1];
      i++;
    }

    quoteTokenList.length--;
    quotes[_tokenAddress] = false;
  }

  function registerQuoteToken(address _tokenAddress) onlyOwner public {
    quotes[_tokenAddress] = true;
    quoteTokenList.push(_tokenAddress);
  }

  function withdrawRewards() public
  {
    require(msg.sender != 0x0);
    checkCurrentEpoch();

    uint256 lastWithdrawal = withdrawals[msg.sender];
    require(lastWithdrawal != currentEpoch);


    for (uint256 i = 0; i < quoteTokenList.length; i++) {
      address tokenAddress = quoteTokenList[i];
      uint256 totalTokenRewards = 0;

      for (uint256 j = lastWithdrawal; j < currentEpoch; j++)
      {
        uint256 blockNumberAtEpochStart = getBlockNumberAtEpochStart(j);
        uint256 balanceAtEpochStart = tomoToken.balanceOfAt(msg.sender, blockNumberAtEpochStart);
        uint256 totalSupply = tomoToken.totalSupply();

        uint256 currentPoolTokenRewards = (poolBalances[j][tokenAddress] * balanceAtEpochStart) / totalSupply;
        totalTokenRewards = totalTokenRewards + currentPoolTokenRewards;
        poolBalances[j][tokenAddress] -= currentPoolTokenRewards;
      }

      ERC20(tokenAddress).transfer(msg.sender, totalTokenRewards);
    }

    withdrawals[msg.sender] = currentEpoch;
  }

  function checkCurrentEpoch() internal
  {
    uint256 lastEpoch = currentEpoch;
    uint256 computedEpoch = computeCurrentEpoch();

    if (computedEpoch != lastEpoch) {
      for(uint256 i = 0; i < quoteTokenList.length; i++) {
        address tokenAddress = quoteTokenList[i];
        uint256 tokenBalance = ERC20(tokenAddress).balanceOf(rewardCollector);

        RewardCollector(rewardCollector).transferTokensToPool(tokenAddress, tokenBalance);
        poolBalances[computedEpoch - 1][tokenAddress] = tokenBalance;
      }

      currentEpoch = computedEpoch;
    }
  }

  function computeCurrentEpoch() public view returns(uint256 computedCurrentEpoch)
  {
    computedCurrentEpoch = (block.number - creationBlockNumber) / blocksPerEpoch;
    return computedCurrentEpoch;
  }

  function getBlockNumberAtEpochStart(uint256 _epoch) public view returns(uint256 blockNumber)
  {
    blockNumber = creationBlockNumber + blocksPerEpoch * _epoch;
    return blockNumber;
  }
}