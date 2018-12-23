exports.getDetails = (req, res) => {
    res.send({
        publicKey: res.locals.blockchain.wallet.publicKey
    });
};