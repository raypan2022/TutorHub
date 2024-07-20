import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@raypan2022-tickets/common';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { updateRouter } from './routes/update';
import { calendlyCallbackRouter } from './routes/calendly-callback';
import { calendlyStatusRouter } from './routes/calendly-status';
import { calendlyEventsRouter } from './routes/calendly-events';
import { calendlyEventRouter } from './routes/calendly-event';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);

// routes handlers
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(updateRouter);
app.use(calendlyCallbackRouter);
app.use(calendlyStatusRouter);
app.use(calendlyEventsRouter);
app.use(calendlyEventRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
