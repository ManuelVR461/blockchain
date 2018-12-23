const assert = require('assert');

const Block = require('./Block');

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
});