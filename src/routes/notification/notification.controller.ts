import { HttpException } from 'exceptions/index';
import prisma from 'resources/db';

import type { Request, Response, NextFunction } from 'express';

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userName = req.user;

  try {
    const notifications = await prisma.notification.findMany({
      where: { userName },
      select: { message: true, createAt: true },
    });

    res.jsend.success({ ...notifications });
  } catch (error) {
    return next(new HttpException(500, 'server error', error));
  }
}
