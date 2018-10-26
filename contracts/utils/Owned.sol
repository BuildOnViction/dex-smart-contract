pragma solidity 0.4.24;

contract Owned {
    address public owner;

    event SetOwner(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function setOwner(address newOwner) public onlyOwner {
        emit SetOwner(owner, newOwner);
        owner = newOwner;
    }
}