const config = require('config');
const {Logger, ChainUtils} = require('../../../helpers');
const Transaction = require('./transaction');
const _ = require('lodash');
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

    createTransaction(recipient, amount, blockchain, transactionPool) {

        this.balance = this.calculateBalance(blockchain);

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

    calculateBalance(blockchain) {
        
        const walletAddress = this.publicKey;

        let transactions = [];
        _.forEach(blockchain.chain, (block) => {
            _.forEach(block.data, (transaction) => {
                transactions.push(transaction);
            });
        });

        let startTime = 0;
        let balance = this.balance;
        
        let walletTransactions = _.filter(transactions, (transaction) => {return transaction.input.address === walletAddress;});
        if (walletTransactions.length > 0) {
            const mostRecentTransaction = walletTransactions.reduce((prev, next) => prev.input.timestamp > next.input.timestamp ? prev : next);
            balance = _.find(mostRecentTransaction.outputs, (output) => {return output.address === walletAddress;}).amount;
            startTime = mostRecentTransaction.input.timestamp;
        }

        console.log(walletTransactions)

        _.forEach(transactions, (transaction) => {
            if (transaction.input.timestamp > startTime) {
                _.forEach(transaction.outputs, (output) => {
                    if (output.address === walletAddress) {
                        balance += output.amount;
                    }
                });
            }
        });
        
        return balance;
    }

    static blockchainWallet() {
        const wallet = new this();
        wallet.address = 'blockchain-wallet';
        return wallet;
    }
}

module.exports = Wallet;