import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@raypan2022-tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
