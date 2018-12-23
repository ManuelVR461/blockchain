const assert = require('assert');
const TransactionPool = require('./transaction-pool');
const Wallet = require('./wallet');
const Transaction = require('./transaction');
const _ = require('lodash');

describe('TransactionPool', () => {
    let transactionPool, senderWallet, recipientWallet, transaction, amount;
    beforeEach(() => {
        transactionPool = new TransactionPool();
        
        senderWallet = new Wallet();
        recipientWallet = new Wallet();

        amount = 10;
        transaction = Transaction.newTrasaction(senderWallet, recipientWallet.publicKey, amount);
        transactionPool.updateOrAddTransaction(transaction);
    });

    it('should add the transaction', () => {
        const transactionIndex = _.findIndex(transactionPool.transactions, (t) => {return t.id === transaction.id;});
        assert.notEqual(transactionIndex, -1);
    });

    it('should update the transaction', () => {
        let anotherAmount = 20;
        transaction.update(senderWallet, recipientWallet.publicKey, anotherAmount);
        transactionPool.updateOrAddTransaction(transaction);
        
        const transactionIndex = _.findIndex(transactionPool.transactions, (t) => {return t.id === transaction.id;});
        const senderOutput = _.find(transactionPool.transactions[transactionIndex].outputs, (output) => {return output.address === senderWallet.publicKey;});
        assert.equal(senderOutput.amount, (senderWallet.balance - (amount + anotherAmount)));
    });
});