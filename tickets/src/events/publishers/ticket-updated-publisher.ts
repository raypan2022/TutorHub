import { Publisher, Subjects, TicketUpdatedEvent } from '@raypan2022-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
