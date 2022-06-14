import Joi from 'joi';
import { createService } from 'routes';

import me from './me.controller';

export default createService({
  name: '사용자 서비스',
  baseURL: '/user',
  routes: [
    {
      method: 'get',
      path: '/me',
      needAuth: true,
      handler: me,
    },
  ],
});
