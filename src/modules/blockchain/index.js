const Blockchain = require('./Blockchain');
const P2PServer = require('./p2p-server');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet/wallet');
const Miner = require('./mining/Miner');

exports.init = (done) => {
    const blockchain = new Blockchain();
    const transactionPool = new TransactionPool();
    const wallet = new Wallet();

    const p2pServer = new P2PServer(blockchain, transactionPool);

    const miner = new Miner(blockchain, transactionPool, wallet, p2pServer);

    p2pServer.listen();

    done(null, {
        blockchain: blockchain,
        wallet: wallet,
        transactionPool: transactionPool,
        p2pServer: p2pServer,
        miner: miner
    });
};