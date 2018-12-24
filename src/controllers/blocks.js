exports.getAllBlocks = (req, res) => {
  res.send(res.locals.blockchain.blockchain.chain);
};