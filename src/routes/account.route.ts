import express from 'express';
import { balance, create, getAccountDetails } from '../controllers/account.controller.js';

const router = express.Router();

// Register Route
router.post('/', create);
router.get('/', getAccountDetails);
router.get('/balance', balance);


export default router;