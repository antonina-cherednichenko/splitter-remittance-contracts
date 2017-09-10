pragma solidity ^0.4.11;

contract Owned {

	address public owner;

	modifier onlyOwner {require(msg.sender == owner); _;}

	function Owned() {
		owner = msg.sender;
	}

	function changeOwner(address newOwner) 
	   public
	   onlyOwner
	   returns(bool success) 
	{
		require(newOwner != 0);
		owner = newOwner;
		return true;
	}

}