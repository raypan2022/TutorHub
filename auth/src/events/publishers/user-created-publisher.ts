import { Publisher, Subjects, UserCreatedEvent } from '@raypan2022-tickets/common';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
