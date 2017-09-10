pragma solidity ^0.4.11;


contract Splitter {

	mapping(address => uint) public funds;

	event SplitFunds(address sender, address recepient1, address recepient2, uint funds1, uint funds2);
	event WithdrawFunds(address recepient, uint amount);
	
	function splitFunds(address recepient1, address recepient2) 
	   payable 
	   returns (bool success)
	{
		require (msg.value > 0);
		require (recepient1 != 0 && recepient2 != 0);

        //second recepient gets more money if value is odd
		uint funds1 = msg.value / 2;
		uint funds2 = msg.value - funds1;

		funds[recepient1] += funds1;
		funds[recepient2] += funds2;

		return true;

	}

	function withdrawFunds() 
	   returns (bool success)
	{
		require(funds[msg.sender] > 0);

		uint amount = funds[msg.sender];
		funds[msg.sender] = 0;

		if (!msg.sender.send(amount)) throw;

        WithdrawFunds(msg.sender, amount);

		return true;

	}




}