import { HttpException } from 'exceptions/index';
import prisma from 'resources/db';

import type { Request, Response, NextFunction } from 'express';
import type { FollowListQuery } from 'types';

export default async function (
  req: Request<any, any, any, FollowListQuery>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { type, name: userName } = req.query;

  if (typeof userName === 'undefined') {
    return next(new HttpException(400, 'no name'));
  }

  const send = (list: string[]) =>
    res.jsend.success({
      list,
    });

  if (type === 'following') {
    const following = (
      await prisma.follow.findMany({
        where: { userName },
        select: { followName: true },
        orderBy: { startFollowingAt: 'desc' },
      })
    ).map(({ followName }) => followName);

    send(following);
  } else if (type === 'follower') {
    const follower = (
      await prisma.follow.findMany({
        where: { followName: userName },
        select: { userName: true },
        orderBy: { startFollowingAt: 'desc' },
      })
    ).map(({ userName }) => userName);

    send(follower);
  } else {
    return next(new HttpException(400, 'wrong type'));
  }
}
