pragma solidity ^0.4.11;


contract Remittance {

	struct Funds {
		address owner;
		uint amount;
		uint deadline;
	}

	mapping(bytes32 => Funds) public allFunds;

	event Deposit(address owner, uint amount, uint deadline, bytes32 finalHash);
	event Withdraw(address sender, uint blockNumber, uint deadline, uint amount);

	function deposit(bytes32 finalHash, uint deadline) 
	   payable
	   returns(bool success)
	{
		require(msg.value > 0);
		require(finalHash != 0);

		allFunds[finalHash] = Funds({owner: msg.sender, amount: msg.value, deadline: block.number + deadline});

		Deposit(msg.sender, msg.value, deadline, finalHash);

		return true;
	}

	function withdraw(bytes32 hash1, bytes32 hash2) 
	  returns (bool success)
	{
		bytes32 finalHash = keccak256(hash1, hash2);

		Funds storage funds = allFunds[finalHash];
		require(funds.amount > 0);

		if (msg.sender == funds.owner) {
			require(funds.deadline <= block.number);
		} else {
			require(funds.deadline > block.number);
		}

        uint amount = funds.amount;
		funds.amount = 0;
		msg.sender.transfer(amount);

		Withdraw(msg.sender, block.number, funds.deadline, amount);

		return true;
	}

}
