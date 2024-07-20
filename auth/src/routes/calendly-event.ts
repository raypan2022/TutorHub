import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import { validateRequest, BadRequestError } from '@raypan2022-tickets/common';
import { User } from '../models/user'; // Adjust the import path as needed
import { getEventTypeByUri } from '../services/calendly-api'; // Adjust the import path as needed

const router = express.Router();

router.get(
  '/api/users/calendly/event-type',
  [query('userId').notEmpty().withMessage('User ID is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { userId } = req.query;

    const user = await User.findById(userId);

    if (
      !user ||
      !user.userURI ||
      !user.calendlyAccessToken ||
      !user.calendlyRefreshToken ||
      !user.eventuuid
    ) {
      throw new BadRequestError('Invalid credentials');
    }

    const event = await getEventTypeByUri(
      user.eventuuid,
      user.calendlyAccessToken,
      user.calendlyRefreshToken
    );

    res.send({ event, username: user.name });
  }
);

export { router as calendlyEventRouter };
