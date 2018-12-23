const Blockchain = require('./public/Blockchain');

exports.init = (done) => {
    done(new Blockchain());
};