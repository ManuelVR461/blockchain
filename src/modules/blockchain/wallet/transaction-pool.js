const _ = require('lodash');

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
}

module.exports = TransactionPool;