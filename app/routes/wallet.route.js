const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.post('/setup', walletController.setupWallet);
router.post('/transact/:walletId', walletController.addTransaction);
router.get('/transactions', walletController.getTransactions);
router.get('/wallet/:walletId', walletController.getWallet);

module.exports = router;