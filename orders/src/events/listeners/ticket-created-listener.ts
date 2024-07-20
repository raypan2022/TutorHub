import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@raypan2022-tickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price, level, subject } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
      level,
      subject
    });
    await ticket.save();

    msg.ack();
  }
}
