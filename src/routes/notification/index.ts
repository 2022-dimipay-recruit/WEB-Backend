import { createService } from 'routes';

import notification from './notification.controller';

export default createService({
  name: 'notifications',
  baseURL: '/notification',
  routes: [{ method: 'get', path: '/', needAuth: true, handler: notification }],
});
