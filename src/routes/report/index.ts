import { createService } from 'routes';
import Joi from 'joi';

import report from './report.controller';

export default createService({
  name: 'report',
  baseURL: '/report',
  routes: [
    {
      method: 'post',
      path: '/',
      needAuth: true,
      handler: report,
      validateSchema: {
        id: Joi.string().required(),
        message: Joi.string().min(5).max(300).required(),
      },
    },
  ],
});
