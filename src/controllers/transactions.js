exports.getAllTransactions = (req, res) => {
  res.send(res.locals.blockchain.transactionPool.transactions);
};
exports.createTransaction = (req, res) => {
  const {recipient, amount} = req.body;
  const transaction = res.locals.blockchain.wallet.createTransaction(
    recipient,
    amount,
    res.locals.blockchain.transactionPool);
  res.locals.blockchain.p2pServer.syncTransaction(transaction);
  res.send(transaction);
};