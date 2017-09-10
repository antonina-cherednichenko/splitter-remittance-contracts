pragma solidity ^0.4.11;

import "./Owned.sol";

contract Stoppable is Owned {

	bool public running;

	modifier onlyIfRunning {require(running == true); _;}

	function Stoppable() {
		running = true;
	}

	function runSwitch(bool onOff) 
	   public
	   onlyOwner
	   returns(bool success)
	{
		running = onOff;
		return true;
	}
}