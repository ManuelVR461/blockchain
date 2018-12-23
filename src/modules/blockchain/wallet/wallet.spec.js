const assert = require('assert');
const TransactionPool = require('./transaction-pool');
const Wallet = require('./wallet');
const Transaction = require('./transaction');
const _ = require('lodash');

describe('Wallet', () => {

    let transactionPool, senderWallet, recipientWallet, amount, transaction, anotherRecipientWallet, anotherAmount, anotherSenderWallet;
    beforeEach(() => {
        transactionPool = new TransactionPool();

        senderWallet = new Wallet();
        recipientWallet = new Wallet();
        amount = 10;
        transaction = Transaction.newTrasaction(senderWallet, recipientWallet.publicKey, amount);
        transactionPool.updateOrAddTransaction(transaction);

        anotherSenderWallet = new Wallet();
        anotherRecipientWallet = new Wallet();
        anotherAmount = 20;
    });

    it('should add transaction to transaction pool', () => {
        let existingTransaction = transactionPool.findTransactionByAddress(anotherSenderWallet.publicKey);
        assert.equal(existingTransaction, undefined);

        anotherSenderWallet.createTransaction(anotherRecipientWallet.publicKey, anotherAmount, transactionPool);
        existingTransaction = transactionPool.findTransactionByAddress(anotherSenderWallet.publicKey);

        assert.notEqual(existingTransaction, undefined);
    });

    it('should update transaction in transaction pool', () => {
        let existingTransaction = transactionPool.findTransactionByAddress(senderWallet.publicKey);
        assert.notEqual(existingTransaction, undefined);

        senderWallet.createTransaction(anotherRecipientWallet.publicKey, anotherAmount, transactionPool);
        existingTransaction = transactionPool.findTransactionByAddress(senderWallet.publicKey);

        const senderOutput = _.find(existingTransaction.outputs, (output) => {return output.address === senderWallet.publicKey;});
        assert.equal(senderOutput.amount, (senderWallet.balance - (amount + anotherAmount)));
    });
});