import prisma from 'resources/db';
import { HttpException } from 'exceptions';

import type { Request, Response, NextFunction } from 'express';
import { UserParams } from 'types';

export default async function (
  req: Request<UserParams>,
  _: Response,
  next: NextFunction
): Promise<void> {
  try {
    await prisma.profile.findUnique({
      rejectOnNotFound: true,
      where: { userName: req.params.name },
    });
    return next();
  } catch (error) {
    return next(new HttpException(400, 'user not found', error));
  }
}
