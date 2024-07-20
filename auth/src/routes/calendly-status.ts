import express from 'express';
import { currentUser, BadRequestError } from '@raypan2022-tickets/common';
import { User } from '../models/user';

const router = express.Router();

router.get('/api/users/calendly/status', currentUser, async (req, res) => {
  const user = await User.findById(req.currentUser!.id);

  if (!user) {
    throw new BadRequestError('Invalid credentials');
  }

  const isConnected = !!user.calendlyAccessToken;
  const hasEvent = !!user.eventuuid;

  res.send({ isConnected, hasEvent });
});

export { router as calendlyStatusRouter }