const _ = require('lodash');
const config = require('config');
const WebSocket = require('ws');
const {Logger} = require('../../helpers');

const WEB_SOCKET_PORT = config.get('blockchain.websocket.port');
const peers = _.filter(_.split(config.get('blockchain.websocket.peers'), ','), function (peer) {return !_.isEmpty(peer);});

const MESSAGE_TYPES = {
    BLOCKCHAIN: 'blockchain',
    TRANSACTION: 'transaction',
    CLEAR_TRANSACTIONS: 'clear_transactions'
};

class P2PServer {
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
        this.server = null;
    }

    sendChain(socket) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.BLOCKCHAIN,
            data: this.blockchain.chain
        }));
    }

    syncChains() {
        const THIS = this;
        _.forEach(THIS.sockets, (socket) => {
            THIS.sendChain(socket);
        });
    }

    syncTransaction(transaction) {
        const THIS = this;
        _.forEach(THIS.sockets, (socket) => {
            socket.send(JSON.stringify({
                type: MESSAGE_TYPES.TRANSACTION,
                data: transaction
            }));
        });
    }

    broadcastClearTransactions() {
        const THIS = this;
        _.forEach(THIS.sockets, (socket) => {
            socket.send(JSON.stringify({
                type: MESSAGE_TYPES.CLEAR_TRANSACTIONS
            }));
        });
    }
    
    connectSocket(socket) {
        Logger.info(`P2PServer connectSocket: Socket connected`);
        this.sockets.push(socket);
        this.messageHandler(socket);
        this.sendChain(socket);
    }

    listen() {
        Logger.info(`P2PServer listen: Listening for peer to peer connections on: ${WEB_SOCKET_PORT}`);
        this.server = new WebSocket.Server({port: WEB_SOCKET_PORT});
        this.server.on('connection', socket => this.connectSocket(socket));
        this.connectToPeers();
    }

    connectToPeers() {
        const THIS = this;
        _.forEach(peers, (peer) => {
            const socket = new WebSocket(peer);
            socket.on('open', () => THIS.connectSocket(socket));
        });
    }

    messageHandler(socket) {
        const THIS = this;
        socket.on('message', message => {
            const data = JSON.parse(message);
            Logger.info(`P2PServer messageHandler: `, data);
            if (data.type === MESSAGE_TYPES.TRANSACTION) {
                THIS.transactionPool.updateOrAddTransaction(data.data);
            } else if(data.type === MESSAGE_TYPES.BLOCKCHAIN) {
                THIS.blockchain.replaceChain(data.data);
            } else if(data.type === MESSAGE_TYPES.CLEAR_TRANSACTIONS) {
                THIS.transactionPool.clear();
            }
        });
    }
    
    onTransactionAddOrUpdate(transaction) {
        const THIS = this;
        _.forEach(THIS.sockets, (socket) => {
            THIS.broadcastTransaction(socket, transaction);
        });
    }
}

module.exports = P2PServer;