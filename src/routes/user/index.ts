import { createService } from 'routes';
import checkExistingUser from 'middlewares/checkExistingUser';
import Joi from 'joi';

import user from './user.controller';
import list from './list.controller';
import find from './find.controller';
import follow from './follow.controller';
import followList from './followList.controller';
import myQuestions from './myQuestions.controller';
import feed from './feed.controller';

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
    {
      method: 'post',
      path: '/follow',
      needAuth: true,
      handler: follow,
      validateSchema: {
        followName: Joi.string().required(),
      },
    },
    {
      method: 'get',
      path: '/follow/list',
      needAuth: false,
      handler: followList,
    },
    {
      method: 'get',
      path: '/me/questions',
      needAuth: true,
      handler: myQuestions,
    },
    {
      method: 'get',
      path: '/feed',
      needAuth: false,
      handler: feed,
    },
  ],
});
