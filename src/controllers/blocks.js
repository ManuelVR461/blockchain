exports.getAllBlocks = (req, res) => {
  res.send(res.locals.blockchain.chain);
};
