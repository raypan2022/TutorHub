import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:subject', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    subject: req.params.subject,
  }).populate('user');

  res.send(tickets);
});

export { router as indexTicketRouter };
