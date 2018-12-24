exports.getDetails = (req, res) => {
    res.send({
        publicKey: res.locals.blockchain.wallet.publicKey,
        balance: res.locals.blockchain.wallet.calculateBalance(res.locals.blockchain.blockchain)
    });
};