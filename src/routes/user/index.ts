import { createService } from 'routes';
import checkExistingUser from 'middlewares/checkExistingUser';

import user from './user.controller';
import list from './list.controller';

export default createService({
  name: 'user',
  baseURL: '/user',
  routes: [
    {
      method: 'get',
      path: '/',
      needAuth: true,
      handler: user,
    },

    {
      method: 'get',
      path: '/:name',
      needAuth: false,
      middlewares: [checkExistingUser],
      handler: user,
    },
    {
      method: 'get',
      path: '/list/:name',
      needAuth: false,
      middlewares: [checkExistingUser],
      handler: list,
    },
  ],
});
