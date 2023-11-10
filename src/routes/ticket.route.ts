import express from 'express';
import { acquireTicket, createTicket, getTickets } from '../controllers/ticket.controller.js';

const router = express.Router();

// Register Route
router.post('/', createTicket);
router.get('/', getTickets);
router.post('/acquire', acquireTicket);


export default router;