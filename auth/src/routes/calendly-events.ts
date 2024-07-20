import express from 'express';
import { BadRequestError, currentUser } from '@raypan2022-tickets/common';

import { User } from '../models/user';
import { getEventTypes } from '../services/calendly-api';

const router = express.Router();

router.get('/api/users/calendly/event-types', currentUser, async (req, res) => {
  const user = await User.findById(req.currentUser!.id);

  if (!user || !user.userURI || !user.calendlyAccessToken || !user.calendlyRefreshToken) {
    throw new BadRequestError('Invalid credentials');
  }

  const eventTypes = await getEventTypes(
    user.userURI,
    user.calendlyAccessToken,
    user.calendlyRefreshToken
  );

  res.send(eventTypes);
});

export { router as calendlyEventsRouter }