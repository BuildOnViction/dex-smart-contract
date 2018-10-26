pragma solidity 0.4.24;

/**
@title ERC20 interface
@dev See https://github.com/ethereum/EIPs/issues/20
*/
contract ERC20 {

  string  public name;
  string  public symbol;
  uint8   public decimals;
  uint256 public totalTokenSupply;

  mapping(address => uint256) internal balances;
  mapping(address => mapping(address => uint256)) internal allowed;

  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);

  function totalSupply() public view returns (uint256);
  function balanceOf(address _owner) public view returns (uint256 balance);
  function allowance(address _owner, address _spender) public view returns (uint256 remaining);
  function transfer(address _to, uint256 _value) public returns (bool success);
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);
  function approve(address _spender, uint256 _value) public returns (bool success);
}
