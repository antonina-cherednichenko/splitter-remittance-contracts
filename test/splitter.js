var Splitter = artifacts.require("./Splitter.sol");
let Promise = require('bluebird');

if (typeof web3.eth.getAccountsPromise !== 'function') {
    Promise.promisifyAll(web3.eth, { suffix: 'Promise' })
}

contract('Splitter', function(accounts) {

  let splitter;

  let owner = accounts[0];
  let recepient1 = accounts[1];
  let recepient2 = accounts[2];


  beforeEach(function() {
    return Splitter.new({from: owner})
      .then(function(instance) {
        splitter = instance;
      });
  });

  it("split funds emits valid event", async () => { 

    let contribution = 4;
    let funds1 = 2;
    let funds2 = 2;

    let tx = await splitter.splitFunds(recepient1, recepient2, {from: owner, value: contribution});

    assert(tx.logs.length == 1, `expected 1 log, emitted ${tx.logs.length}`);
    let log = tx.logs[0]
    assert(log.event == 'SplitFunds', `expected SplitFunds, emitted ${log.event}`)
    assert(log.args.sender == accounts[0], `sender should have been ${accounts[0]}, got ${log.args.depositor}`)
    assert(log.args.recepient1 == accounts[1], `recepient1 should have been ${accounts[1]}, got ${log.args.one}`)
    assert(log.args.recepient2 == accounts[2], `recepient2 should have been ${accounts[2]}, got ${log.args.two}`)
    assert(log.args.funds1.equals(funds1), `funds1 should have been ${contribution / 2}, got ${log.args.funds1.toString()}`)
    assert(log.args.funds2.equals(funds2), `funds2 should have been ${contribution - (contribution / 2)}, got ${log.args.funds2.toString()}`)
    
  });

it("split funds works!", async () => { 

    let contribution = 5;
    let funds1 = 2;
    let funds2 = 3;

    let balanceBefore = web3.eth.getBalance(owner);

    let tx = await splitter.splitFunds(recepient1, recepient2, {from: owner, value: contribution});

    let balanceAfter = web3.eth.getBalance(owner);

    let gasPrice = (await web3.eth.getTransactionPromise(tx.tx)).gasPrice
    let totalGasCost = gasPrice.times(tx.receipt.gasUsed)

    assert(balanceAfter.toNumber() == balanceBefore.minus(contribution).minus(totalGasCost).toNumber(), "owner balance is not correct");
    
    let recepient1Funds = await splitter.funds(recepient1);
    let recepient2Funds = await splitter.funds(recepient2);
    let recepient1Balance = web3.eth.getBalance(recepient1);
    let recepient2Balance = web3.eth.getBalance(recepient2);

    assert(funds1 == recepient1Funds.toNumber(), "recepient1 balance is not correct");
    assert(funds2 == recepient2Funds.toNumber(), "recepient2 balance is not correct")  
    
  });


it("withdraw funds works!", async () => { 

    let contribution = 5;
    let funds1 = 2;
    let funds2 = 3;

    let balanceBeforeR1 = web3.eth.getBalance(recepient1);
    let balanceBeforeR2 = web3.eth.getBalance(recepient2);

    let tx = await splitter.splitFunds(recepient1, recepient2, {from: owner, value: contribution});

    let txWithdraw1 = await splitter.withdrawFunds({from: recepient1});
    let txWithdraw2 = await splitter.withdrawFunds({from: recepient2});

    let gasPrice1 = (await web3.eth.getTransactionPromise(txWithdraw1.tx)).gasPrice;
    let totalGasCost1 = gasPrice1.times(txWithdraw1.receipt.gasUsed);

    let gasPrice2 = (await web3.eth.getTransactionPromise(txWithdraw2.tx)).gasPrice;
    let totalGasCost2 = gasPrice2.times(txWithdraw2.receipt.gasUsed);

    let recepient1Funds = await splitter.funds(recepient1);
    let recepient2Funds = await splitter.funds(recepient2);
    assert(recepient1Funds.toNumber() == 0, "withdraw failed for first recepient");
    assert(recepient2Funds.toNumber() == 0, "withdraw failed for first recepient");

    let recepient1Balance = web3.eth.getBalance(recepient1);
    let recepient2Balance = web3.eth.getBalance(recepient2);

    assert(recepient1Balance.equals(balanceBeforeR1.plus(funds1).minus(totalGasCost1)), "recepient1 balance is not correct");
    assert(recepient2Balance.equals(balanceBeforeR2.plus(funds2).minus(totalGasCost2)), "recepient2 balance is not correct");
    
  });



  
});
