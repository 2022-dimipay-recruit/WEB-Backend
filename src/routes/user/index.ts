import { createService } from 'routes';
import checkExistingUser from 'middlewares/checkExistingUser';

import user from './user.controller';
import list from './list.controller';
import find from './find.controller';

export default createService({
  name: 'user',
  baseURL: '/user',
  routes: [
    {
      method: 'get',
      path: '/me',
      needAuth: true,
      handler: user,
    },
    {
      method: 'get',
      path: '/',
      needAuth: false,
      middlewares: [checkExistingUser],
      handler: user,
    },
    {
      method: 'get',
      path: '/list/',
      needAuth: false,
      middlewares: [checkExistingUser],
      handler: list,
    },
    {
      method: 'get',
      path: '/find',
      needAuth: false,
      handler: find,
    },
  ],
});
