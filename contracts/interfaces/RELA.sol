pragma solidity ^0.4.24;

/**
 * @title RELA (RELA)
 * Standard Mintable ERC20 Token
 * https://github.com/ethereum/EIPs/issues/20
 * Based on code by FirstBlood:
 * https://github.com/Firstbloodio/token/blob/master/smart_contract/FirstBloodToken.sol
 */
contract RELAInterface
{
  event Mint(address indexed to, uint256 amount);
  event MintFinished();
  event ClaimedTokens(address indexed _token, address indexed _owner, uint _amount);
  event NewCloneToken(address indexed _cloneToken, uint _snapshotBlock);
  event Approval(address indexed _owner, address indexed _spender, uint256 _amount);
  event Transfer(address indexed from, address indexed to, uint256 value);

  function totalSupply() public view returns (uint);
  function totalSupplyAt(uint _blockNumber) public view returns(uint);
  function balanceOf(address _owner) public view returns (uint256 balance);
  function balanceOfAt(address _owner, uint _blockNumber) public view returns (uint);
  function transfer(address _to, uint256 _amount) public returns (bool success);
  function transferFrom(address _from, address _to, uint256 _amount) public returns (bool success);
  function approve(address _spender, uint256 _amount) public returns (bool success);
  function approveAndCall(address _spender, uint256 _amount,  bytes memory _extraData ) public returns (bool success);
  function allowance(address _owner, address _spender) public view returns (uint256 remaining);
  function mint(address _owner, uint _amount) public returns (bool);

}
