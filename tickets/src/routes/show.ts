import express, { Request, Response } from 'express';
import { NotFoundError } from '@raypan2022-tickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/lesson/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id).populate('user');

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as showTicketRouter };
