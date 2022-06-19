import prisma from 'resources/db';
import { HttpException } from 'exceptions';
import { verify } from 'resources/token';

import type { Request, Response, NextFunction } from 'express';
import { UserParams } from 'types';

export default async function (
  req: Request<any, any, any, UserParams>,
  _: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userName = req.query.name;

    await prisma.profile.findUnique({
      rejectOnNotFound: true,
      where: { userName },
    });

    req.user = userName;

    return next();
  } catch (error) {
    return next(new HttpException(400, 'user not found', error));
  }
}
