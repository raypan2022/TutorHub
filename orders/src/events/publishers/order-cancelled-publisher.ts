import { Subjects, Publisher, OrderCancelledEvent } from '@raypan2022-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
