const {Logger, ChainUtils} = require('../../../helpers');
const _ = require('lodash');

class Transaction {
    constructor() {
        this.id = ChainUtils.id();
        this.input = null;
        this.outputs = [];
    }

    toString() {
        return `Transaction -
            Id: ${this.id}
        `;
    }

    update(senderWallet, recipient, amount) {
        const output = _.find(this.outputs, (output) => {return output.address === senderWallet.publicKey});
        if (amount > output.amount) {
            Logger.warn('Transaction update: Amount exceeds sender balance');
            return;
        }

        output.amount = output.amount - amount;
        this.outputs.push({
            amount: amount,
            address: recipient
        });
        Transaction.signTransaction(this, senderWallet);

        return this;
    }

    static newTrasaction(senderWallet, recipient, amount) {
        if (amount > senderWallet.balance) {
            Logger.warn('Transaction newTrasaction: Amount exceeds sender balance');
            return;
        }

        const transaction = new this();
        transaction.outputs.push(...[
            {amount: (senderWallet.balance - amount), address: senderWallet.publicKey},
            {amount: amount, address: recipient}
        ]);
        Transaction.signTransaction(transaction, senderWallet);

        return transaction;
    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtils.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction) {
        return ChainUtils.verifySignature(transaction.input.address, transaction.input.signature, ChainUtils.hash(transaction.outputs));
    }
}

module.exports = Transaction;
