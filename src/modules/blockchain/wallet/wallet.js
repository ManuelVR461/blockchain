const config = require('config');
const {Logger, ChainUtils} = require('../../../helpers');
const Transaction = require('./transaction');

const INITIAL_BALANCE = parseFloat(config.get('blockchain.walletInitialBalance'));

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtils.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet - 
            Balance   : ${this.balance}
            PublicKey : ${this.publicKey}
        `;
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, transactionPool) {
        if (this.balance < amount) {
            Logger.warn('Wallet createTransaction: Amount exceeds wallet balance');
            return;
        }

        let transaction = transactionPool.findTransactionByAddress(this.publicKey);
        if (transaction) {
            transaction.update(this, recipient, amount);
        } else {
            transaction = Transaction.newTrasaction(this, recipient, amount);
        }

        transactionPool.updateOrAddTransaction(transaction);
        return transaction;
    }
}

module.exports = Wallet;