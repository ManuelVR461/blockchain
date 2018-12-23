const assert = require('assert');

const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
    let blockchain, anotherBlockchain;
    beforeEach(() => {
        blockchain = new Blockchain();
        anotherBlockchain = new Blockchain();
    });

    it('should start with the gensis block', () => {
        assert.equal(blockchain.chain[0].hash, Block.genesis().hash);
    });

    it('should add new block to the end of the chain', () => {
        const data = 'Test Data';
        blockchain.addBlock(data);

        assert.equal(blockchain.chain[blockchain.chain.length - 1].data, data);
    });

    it('should validates a valid chain', () => {
        anotherBlockchain.addBlock('Test');
        assert.equal(blockchain.isValidChain(anotherBlockchain.chain), true);
    });

    it('should invalidate a chain with corrupt gensis block', () => {
        anotherBlockchain.chain[0].data = 'Bad Data';
        assert.equal(blockchain.isValidChain(anotherBlockchain.chain), false);
    });

    it('should invalidate a corrupt chain', () => {
        anotherBlockchain.addBlock('Test');
        anotherBlockchain.chain[1].data = 'Tampered Data';
        assert.equal(blockchain.isValidChain(anotherBlockchain.chain), false);
    });

    it('should replace a chain with valid chain', () => {
        anotherBlockchain.addBlock('Test');
        blockchain.replaceChain(anotherBlockchain.chain);
        assert.deepEqual(blockchain.chain, anotherBlockchain.chain);
    });

    it('should not replace a chain with one or less than equal to length', () => {
        blockchain.addBlock('Test');
        blockchain.replaceChain(anotherBlockchain.chain);
        assert.notDeepEqual(blockchain.chain, anotherBlockchain.chain);
    });
});