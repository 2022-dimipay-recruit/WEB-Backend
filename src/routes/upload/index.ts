import multer from 'multer';
import { createService } from 'routes';

import upload from './upload.controller';

const multeUupload = multer();

export default createService({
  baseURL: '/upload',
  name: 'upload',
  routes: [
    {
      method: 'post',
      path: '/',
      needAuth: true,
      middlewares: [multeUupload.single('image')],
      handler: upload,
    },
  ],
});
