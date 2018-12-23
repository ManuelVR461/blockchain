const Blockchain = require('./public/Blockchain');

exports.init = (done) => {
    done(null, new Blockchain());
};