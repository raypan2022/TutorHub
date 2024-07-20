import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  BadRequestError,
  currentUser,
} from '@raypan2022-tickets/common';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { natsWrapper } from '../nats-wrapper';
import { UserUpdatedPublisher } from '../events/publishers/user-updated-publisher';

const router = express.Router();

router.post(
  '/api/users/update',
  [body('name').notEmpty().withMessage('You must supply a name')],
  validateRequest,
  currentUser,
  async (req: Request, res: Response) => {
    const { name, description, eventuuid } = req.body;

    const user = await User.findById(req.currentUser!.id);

    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    user.set({
      name,
      description,
      eventuuid,
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
      eventuuid: user.eventuuid,
      userURI: user.userURI
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

    res.send(user);
  }
);

export { router as updateRouter };
