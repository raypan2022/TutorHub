import { Publisher, Subjects, UserUpdatedEvent } from '@raypan2022-tickets/common';

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
}
