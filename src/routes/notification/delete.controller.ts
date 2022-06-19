import { HttpException } from 'exceptions/index';
import prisma from 'resources/db';

import type { Request, Response, NextFunction } from 'express';
import type { NotificationDelete } from 'types';

export default async function (
  req: Request<any, NotificationDelete>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.body;

  try {
    await prisma.notification.delete({
      where: { id },
    });

    res.jsend.success({});
  } catch (error) {
    return next(new HttpException(500, 'server error', error));
  }
}
