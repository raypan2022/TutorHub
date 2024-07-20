import { Publisher, Subjects, TicketCreatedEvent } from '@raypan2022-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
