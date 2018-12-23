exports.getAllBlocks = (req, res) => {
  res.send(res.locals.blockchain.chain);
};

exports.addBlock = (req, res) => {
  const newBlock = res.locals.blockchain.addBlock(req.body.data);
  res.send(newBlock);
}