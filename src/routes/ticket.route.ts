import express from 'express';
import { acquireTicket, createTicket } from '../controllers/ticket.controller.js';

const router = express.Router();

// Register Route
router.post('/', createTicket);
router.post('/acquire', acquireTicket);


export default router;