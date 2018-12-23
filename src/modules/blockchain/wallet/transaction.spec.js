const assert = require('assert');
const Wallet = require('./wallet');
const Transaction = require('./transaction');
const _ = require('lodash');

describe('Transaction', () => {
    let senderWallet, recipientWallet, anotherRecipientWallet;

    beforeEach(() => {
        senderWallet = new Wallet();
        recipientWallet = new Wallet();
        anotherRecipientWallet = new Wallet();
    });

    it('should generate correct outputs array', () => {
        const amount = 10;
        const transaction = Transaction.newTrasaction(
            senderWallet,
            recipientWallet.publicKey,
            amount
        );

        assert.equal(transaction.outputs.length, 2);
        assert.equal(transaction.outputs[0].address, senderWallet.publicKey);
        assert.equal(transaction.outputs[0].amount, (senderWallet.balance - amount));
        assert.equal(transaction.outputs[1].address, recipientWallet.publicKey);
        assert.equal(transaction.outputs[1].amount, amount);
    });

    it('should not create a transaction if amount exceeds sender wallet balance', () => {
        const amount = senderWallet.balance + 10;
        const transaction = Transaction.newTrasaction(
            senderWallet,
            recipientWallet.publicKey,
            amount
        );
        assert.equal(transaction, undefined);
    });
    
    it('should input the balance of the wallet', () => {
        const amount = 10;
        const transaction = Transaction.newTrasaction(
            senderWallet,
            recipientWallet.publicKey,
            amount
        );
        assert.equal(transaction.input.amount, senderWallet.balance);
    });

    it('should validate a valid transaction', () => {
        const amount = 10;
        const transaction = Transaction.newTrasaction(
            senderWallet,
            recipientWallet.publicKey,
            amount
        );
        assert.equal(Transaction.verifyTransaction(transaction), true);
    });

    it('should invalidate an invalid transaction', () => {
        const amount = 10;
        const transaction = Transaction.newTrasaction(
            senderWallet,
            recipientWallet.publicKey,
            amount
        );
        transaction.outputs[0].amount = senderWallet.balance;
        assert.equal(Transaction.verifyTransaction(transaction), false);
    });

    describe('update', () => {
        let transaction, amount, anotherAmount;
        beforeEach(() => {
            amount = 10;
            anotherAmount = 20;

            transaction = Transaction.newTrasaction(
                senderWallet,
                recipientWallet.publicKey,
                amount
            );
            transaction.update(senderWallet, anotherRecipientWallet.publicKey, anotherAmount);
        });

        it('subtracts the next amount from sender output', () => {
            const senderOutput = _.find(transaction.outputs, (output) => {return output.address === senderWallet.publicKey});
            assert.equal(senderOutput.amount, (senderWallet.balance - (amount + anotherAmount)));
        });

        it('should output amount for another recipient', () => {
            const anotherRecipientOutput = _.find(transaction.outputs, (output) => {return output.address === anotherRecipientWallet.publicKey});
            assert.equal(anotherRecipientOutput.amount, anotherAmount);
        });
    });
});