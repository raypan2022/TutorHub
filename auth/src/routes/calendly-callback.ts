import express from 'express';
import jwt from 'jsonwebtoken';
import {
  currentUser,
  BadRequestError,
  InternalError,
} from '@raypan2022-tickets/common';

import { User } from '../models/user';
import { UserUpdatedPublisher } from '../events/publishers/user-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
import { getAccessToken, getUserURI } from '../services/calendly-api';

const router = express.Router();

router.get('/api/users/calendly/callback', currentUser, async (req, res) => {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    throw new BadRequestError('Unable to retrieve calendly code');
  }

  const user = await User.findById(req.currentUser!.id);

  if (!user) {
    throw new BadRequestError('Invalid credentials');
  }

  try {
    const { access_token, refresh_token } = await getAccessToken(code);

    const userURI = await getUserURI(access_token, refresh_token);

    user.set({
      calendlyAccessToken: access_token,
      calendlyRefreshToken: refresh_token,
      userURI: userURI,
    });

    await user.save();

    new UserUpdatedPublisher(natsWrapper.client).publish({
      id: user.id,
      version: user.version,
      email: user.email,
      name: user.name,
      description: user.description,
      calendlyAccessToken: user.calendlyAccessToken,
      calendlyRefreshToken: user.calendlyRefreshToken,
      userURI: userURI,
    });

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        description: user.description,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.send({});
  } catch (error) {
    console.log(error);
    throw new InternalError(
      'Something went wrong while logging in to Calendly'
    );
  }
});

export { router as calendlyCallbackRouter };
