import { createService } from 'routes';

import root from './root.controller';

export default createService({
  name: 'root',
  baseURL: '/',
  routes: [{ method: 'get', path: '/', needAuth: false, handler: root }],
});
