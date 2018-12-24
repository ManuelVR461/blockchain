const _ = require('lodash');
const {Logger} = require('../../../helpers');
const Transaction = require('./transaction');

class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    updateOrAddTransaction(transaction) {
        let transactionIndex = _.findIndex(this.transactions, (t) => {return t.id === transaction.id;});
        const transactionClone = _.cloneDeep(transaction);
        if (transactionIndex !== -1) {
            this.transactions[transactionIndex] = transactionClone;
        } else {
            this.transactions.push(transactionClone);
        }
    }

    findTransactionByAddress(address) {
        return _.find(this.transactions, (t) => {return t.input.address === address;});
    }

    validTransactions() {
        return _.filter(this.transactions, (t) => {
            var totalOutput = _.reduce(t.outputs, (total, output) => {
                return total + output.amount;
            }, 0);

            if (totalOutput !== t.input.amount) {
                Logger.warn('TransactionPool validTransactions: Invalid transaction, input amount does not match with total output amount');
                return;
            }

            if (!Transaction.verifyTransaction(t)) {
                Logger.warn('TransactionPool validTransactions: Invalid transaction, unable to verify');
                return;
            }

            return t;
        });
    }

    clear() {
        this.transactions = [];
    }
}

module.exports = TransactionPool;