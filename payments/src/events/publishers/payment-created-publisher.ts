import { Subjects, Publisher, PaymentCreatedEvent } from '@raypan2022-tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
