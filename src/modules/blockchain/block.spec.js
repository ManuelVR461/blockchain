const assert = require('assert');
const Block = require('./block');

const config = require('config');
const MINE_RATE = parseInt(config.get('blockchain.miningRate'));

describe('Block', () => {

    let data, lastBlock, block;
    beforeEach(() => {
        data = 'Hello World';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });

    it('sets the `data` to match the input', () => {
        assert.equal(block.data, data);
    });
    it('sets the `lastHash` to match the hash of the last block', () => {
        assert.equal(block.lastHash, lastBlock.hash);
    });
    it('generates a hash that matches the difficulty', () => {
        assert.equal(block.hash.substring(0, block.difficulty), '0'.repeat(block.difficulty));
    });
    it('should lower difficulty for slowly mined blocks', () => {
        assert.equal(Block.adjustDifficulty(block, (block.timestamp + (MINE_RATE * 2))), (block.difficulty - 1));
    });
    it('should increase difficulty for fastly mined blocks', () => {
        assert.equal(Block.adjustDifficulty(block, (block.timestamp + (MINE_RATE * 0.5))), (block.difficulty + 1));
    });
});