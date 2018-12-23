const _ = require('lodash');
const config = require('config');
const WebSocket = require('ws');
const {Logger} = require('../../../helpers');

const WEB_SOCKET_PORT = config.get('websocket.port');
const peers = _.filter(_.split(config.get('websocket.peers'), ','), function (peer) {return !_.isEmpty(peer);});

class P2PServer {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
        this.server = null;
        this.blockchain.addEventListener(this);
    }

    sendChain(socket) {
        socket.send(JSON.stringify(this.blockchain.chain));
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
            THIS.blockchain.replaceChain(data);
        });
    }

    onBlockAdded() {
        const THIS = this;
        _.forEach(THIS.sockets, (socket) => {
            THIS.sendChain(socket);
        })
    };
}

module.exports = P2PServer;