import { createService } from 'routes';
import Joi from 'joi';

import notification from './notification.controller';
import deleteNotification from './delete.controller';
import changeNotification from './change.controller';

export default createService({
  name: 'notifications',
  baseURL: '/notification',
  routes: [
    { method: 'get', path: '/', needAuth: true, handler: notification },
    {
      method: 'delete',
      path: '/',
      needAuth: true,
      handler: deleteNotification,
      validateSchema: {
        id: Joi.string().required(),
      },
    },
    {
      method: 'patch',
      path: '/',
      needAuth: true,
      handler: changeNotification,
      validateSchema: {
        id: Joi.string().required(),
        status: Joi.string()
          .regex(/^(read|unread)$/)
          .required(),
      },
    },
  ],
});
