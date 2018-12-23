const Block = require('./Block');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);

        return block;
    }
    
    isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let i = 1; i < chain.length; i += 1) {
            const block = chain[i];
            const lastBlock = chain[i-1];

            if(block.lastHash !== lastBlock.hash
                || block.hash !== Block.blockHash(block)) {
                return false;
            }
        }

        return true;
    }

    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.warn('Blockchain replaceChain: chain is not longer than the current chain');
            return;
        } else if (!this.isValidChain(chain)) {
            console.warn('Blockchain replaceChain: chain is not valid');
            return;
        }

        console.info('Blockchain replaceChain: replacing blockchain');
        this.chain = chain;
    }
}

module.exports = Blockchain;