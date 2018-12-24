exports.getAllTransactions = (req, res) => {
  res.send(res.locals.blockchain.transactionPool.transactions);
};
exports.createTransaction = (req, res) => {
  const {recipient, amount} = req.body;
  const transaction = res.locals.blockchain.wallet.createTransaction(
    recipient,
    amount,
    res.locals.blockchain.blockchain,
    res.locals.blockchain.transactionPool);
  res.locals.blockchain.p2pServer.syncTransaction(transaction);
  res.send(transaction);
};
exports.mine = (req, res) => {
  const block = res.locals.blockchain.miner.mine();
  res.send(block);
}