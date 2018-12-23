const Blockchain = require('./public/Blockchain');
const P2PServer = require('./public/P2PServer');

exports.init = (done) => {
    const blockchain = new Blockchain();
    const p2pServer = new P2PServer(blockchain);

    p2pServer.listen();
    done(null, blockchain);
};