import Joi from 'joi';
import { createService } from 'routes';

import signup from './signup.controller';
import signin from './signin.controller';
import refresh from './refresh.controller';

export default createService({
  name: '인증 서비스',
  baseURL: '/auth',
  routes: [
    {
      method: 'post',
      path: '/signup',
      needAuth: false,
      validateSchema: {
        userName: Joi.string().required(),
        password: Joi.string().pattern(/^[A-Fa-f0-9]{64}$/),
        name: Joi.string().required(),
        email: Joi.string().email(),
      },
      handler: signup,
    },
    {
      method: 'post',
      path: '/signin',
      needAuth: false,
      validateSchema: {
        email: Joi.string().email(),
        password: Joi.string().pattern(/^[A-Fa-f0-9]{64}$/),
      },
      handler: signin,
    },
    { method: 'post', path: '/refresh', needAuth: false, handler: refresh },
    {
      method: 'post',
      path: '/test',
      needAuth: true,
      handler: (req, res) => {
        res.send('test');
      },
    },
  ],
});
