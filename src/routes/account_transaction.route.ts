import express from 'express';
import {creditUserFromPaymentGateway, creditUserFromUser, getTransactions } from '../controllers/account_transaction.controller.js';

const router = express.Router();

// Register Route
router.post('/send_user', creditUserFromUser);
router.post('/pay_with_gateway', creditUserFromPaymentGateway);
router.get('/', getTransactions);
// router.get('/balance', balance);


export default router;