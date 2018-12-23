exports.getAllBlocks = (req, res) => {
  res.send(res.locals.blockchain.blockchain.chain);
};

exports.addBlock = (req, res) => {
  const newBlock = res.locals.blockchain.blockchain.addBlock(req.body.data);
  res.locals.blockchain.p2pServer.syncChains();
  res.send(newBlock);
}