const Blockchain = require('./Blockchain');
const P2PServer = require('./p2p-server');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet/wallet');

exports.init = (done) => {
    const blockchain = new Blockchain();
    const transactionPool = new TransactionPool();
    const wallet = new Wallet();

    const p2pServer = new P2PServer(blockchain, transactionPool);
    p2pServer.listen();

    done(null, {
        blockchain: blockchain,
        wallet: wallet,
        transactionPool: transactionPool,
        p2pServer: p2pServer
    });
};