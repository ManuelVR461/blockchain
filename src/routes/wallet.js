const express = require('express');
const controller = require('../controllers/wallet');

const router = express.Router({});

router.get('/', controller.getDetails);

module.exports = router;
