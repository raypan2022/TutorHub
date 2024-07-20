import { Publisher, OrderCreatedEvent, Subjects } from '@raypan2022-tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
