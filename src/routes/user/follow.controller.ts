import { HttpException } from 'exceptions/index';
import prisma from 'resources/db';

import type { Request, Response, NextFunction } from 'express';
import type { FollowBody } from 'types';

export default async function (
  req: Request<any, any, FollowBody>,
  res: Response,
  next: NextFunction
) {
  const userName = req.user;
  const { followName } = req.body;

  if (userName === followName) {
    return next(new HttpException(400, 'wrong follow name'));
  }

  try {
    const isFollowing = await prisma.follow.findUnique({
      where: {
        userName_followName: {
          userName,
          followName,
        },
      },
    });

    if (isFollowing == null) {
      await prisma.follow.create({
        data: { followName, userName },
      });
    } else {
      await prisma.follow.delete({
        where: {
          userName_followName: { userName, followName },
        },
      });
    }

    res.jsend.success({});
  } catch (error) {
    return next(new HttpException(500, 'server error', error));
  }
}
