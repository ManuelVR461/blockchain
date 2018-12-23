const SHA256 = require('crypto-js/sha256');

const config = require('config');
const DIFFICULTY = parseInt(config.get('blockchain.difficulty'));
const MINE_RATE = parseInt(config.get('blockchain.miningRate'));

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.data = data;
        this.lastHash = lastHash;
        this.hash = hash;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    toString() {
        return `Block -
            Timestamp  : ${this.timestamp}
            LastHash   : ${this.lastHash}
            Hash       : ${this.hash}
            Nonce      : ${this.nonce}
            Difficulty : ${this.difficulty}
            Data       : ${this.data}
        `;
    }

    static genesis() {
        const timestamp = 0;
        const lastHash = "";
        const data = "";
        const nonce = 0;
        const difficulty = DIFFICULTY;
        const hash = "";
        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, timestamp) {
        let {difficulty} = lastBlock;
        if (lastBlock.timestamp + MINE_RATE > timestamp) {
            return (difficulty + 1);
        } else {
            return (difficulty - 1);
        }
    }

    static mineBlock(lastBlock, data) {
        const lastHash = lastBlock.hash;
        let nonce = 0;
        let timestamp, hash, difficulty;

        do {
            nonce += 1;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        } while(hash.substring(0, difficulty) !== '0'.repeat(difficulty))

        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block) {
        const {timestamp, lastHash, data, nonce, difficulty} = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }
}

module.exports = Block;