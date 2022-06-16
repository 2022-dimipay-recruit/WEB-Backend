import prisma from 'resources/db';
import { HttpException } from 'exceptions';

import type { Request, Response, NextFunction } from 'express';
import type { FindUserParams } from 'types';

export default async function (
  req: Request<any, any, any, FindUserParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const keyword = req.query.keyword;
    res.jsend.success(
      await prisma.profile.findMany({
        where: {
          OR: [
            { userName: { contains: keyword } },
            { id: { contains: keyword } },
          ],
        },
        take: req.query.preview === 'true' ? 10 : undefined,
        select: {
          email: true,
          userName: true,
          name: true,
          image: true,
        },
      })
    );
  } catch (error) {
    return next(new HttpException(500, 'server error', error));
  }
}
