import Joi from 'joi';
import * as controllers from './controllers';
import { createService } from '../index';

export default createService({
  name: '인증 서비스',
  baseURL: '/auth',
  routes: [
    {
      method: 'post',
      path: '/',
      needAuth: false,
      validateSchema: {
        username: Joi.string().required(),
        password: Joi.string().required(),
      },
      handler: controllers.identifyUser,
    },
    {
      method: 'post',
      path: '/signup',
      needAuth: false,
      validateSchema: {
        email: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        name: Joi.string().required()
      },
      handler: controllers.createUser,
    },
    {
      method: 'post',
      needAuth: false,
      path: '/refresh',
      handler: controllers.refreshAccessToken,
    },
  ],
});