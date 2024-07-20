import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
} from '@raypan2022-tickets/common';
import { Ticket } from '../models/ticket';
import { User } from '../models/user';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('tickets').isArray().withMessage('Tickets must be an array'),
    body('tickets.*.title').not().isEmpty().withMessage('Title is required'),
    body('tickets.*.price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body('tickets.*.level').not().isEmpty().withMessage('Level is required'),
    body('tickets.*.subject')
      .not()
      .isEmpty()
      .withMessage('Subject is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { tickets } = req.body;

    const createdTickets = [];

    for (const ticketData of tickets) {
      const { title, price, level, subject } = ticketData;

      const userId = req.currentUser!.id;

      // Find the user that created the ticket
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError();
      }

      const ticket = Ticket.build({
        title,
        price,
        level,
        subject,
        userId,
        user,
      });
      await ticket.save();

      await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        level: ticket.level,
        subject: ticket.subject,
        userId: ticket.userId,
        version: ticket.version,
      });

      createdTickets.push(ticket);
    }

    res.status(201).send(createdTickets);
  }
);

export { router as createTicketRouter };
