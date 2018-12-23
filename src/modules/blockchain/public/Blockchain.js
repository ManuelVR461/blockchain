const _ = require('lodash');
const Block = require('./Block');
const {Logger} = require('../../../helpers');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
        this.eventListeners = [];
    }

    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);
        Logger.info('Blockchain addBlock: Block added; ' + block.toString());

        _.forEach(this.eventListeners, (eventListener) => {
            if (_.isFunction(eventListener.onBlockAdded)) {
                eventListener.onBlockAdded(block);
            }
        });
        
        return block;
    }
    
    isValidChain(chain) {
        if (chain[0].hash !== Block.genesis().hash) {
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

    addEventListener(obj) {
        this.eventListeners.push(obj);
    }
}

module.exports = Blockchain;