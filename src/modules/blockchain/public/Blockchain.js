const Block = require('./Block');
const {Logger} = require('../../../helpers');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);
        Logger.info('Blockchain addBlock: Block added; ' + block.toString());
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
            Logger.warn('Blockchain replaceChain: chain is not longer than the current chain');
            return;
        } else if (!this.isValidChain(chain)) {
            Logger.warn('Blockchain replaceChain: chain is not valid');
            return;
        }

        Logger.info('Blockchain replaceChain: replacing blockchain');
        this.chain = chain;
    }
}

module.exports = Blockchain;