import Joi from 'joi';
import { createService } from 'routes';

import question from './question.controller';

export default createService({
  name: 'post',
  baseURL: '/post',
  routes: [
    {
      method: 'post',
      path: '/question',
      needAuth: true,
      validateSchema: {
        receiver: Joi.string().required(),
        question: Joi.string().min(2).max(300).required(),
        type: Joi.string(),
      },
      handler: question,
    },
  ],
});
