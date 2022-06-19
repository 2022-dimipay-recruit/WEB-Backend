import { HttpException } from 'exceptions/index';
import prisma from 'resources/db';

import type { Request, Response, NextFunction } from 'express';
import type { NotificationChange } from 'types';

export default async function (
  req: Request<any, NotificationChange>,
  res: Response,
  next: NextFunction
) {
  const { id, status } = req.body;

  try {
    await prisma.notification.update({
      where: { id },
      data: { read: status === 'read' },
    });

    res.jsend.success({});
  } catch (error) {
    return next(new HttpException(500, 'server error', error));
  }
}
