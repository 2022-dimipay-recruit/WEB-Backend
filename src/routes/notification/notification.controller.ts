import { HttpException } from 'exceptions/index';
import prisma from 'resources/db';

import type { Request, Response, NextFunction } from 'express';
import type { Notification } from 'types';

export default async function (
  req: Request<any, any, any, Notification>,
  res: Response,
  next: NextFunction
) {
  const userName = req.user;
  const { type } = req.query;

  try {
    const notifications = await prisma.notification.findMany({
      where: { userName, read: type === 'new' ? false : undefined },
      select: {
        id: true,
        createAt: true,
        title: true,
        message: true,
        read: true,
      },
      orderBy: { createAt: 'desc' },
    });

    res.jsend.success(notifications);
  } catch (error) {
    return next(new HttpException(500, 'server error', error));
  }
}
