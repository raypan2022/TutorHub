import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserUpdatedEvent } from '@raypan2022-tickets/common';
import { User } from '../../models/user';
import { queueGroupName } from './queue-group-name';

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserUpdatedEvent['data'], msg: Message) {
    const user = await User.findByEvent(data);

    if (!user) {
      throw new Error('User not found');
    }

    const { name, description, calendlyAccessToken, calendlyRefreshToken, eventuuid, userURI } = data;
    user.set({ name, description, calendlyAccessToken, calendlyRefreshToken, eventuuid, userURI });
    await user.save();

    msg.ack();
  }
}
