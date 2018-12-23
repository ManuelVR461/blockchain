const express = require('express');
const controller = require('../controllers/transactions');

const router = express.Router({});

router.get('/', controller.getAllTransactions);
router.post('/', controller.createTransaction);

module.exports = router;
