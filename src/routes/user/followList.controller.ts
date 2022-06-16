import { HttpException } from 'exceptions/index';
import prisma from 'resources/db';

import type { Request, Response, NextFunction } from 'express';
import type { FollowListQuery } from 'types';

export default async function (
  req: Request<any, any, any, FollowListQuery>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { type, name: userName, startsFrom = 1, take = 10 } = req.query;

  if (typeof userName === 'undefined') {
    return next(new HttpException(400, 'no name'));
  }

  const takeQuery = { skip: +startsFrom - 1, take: +take };

  const send = (list: string[]) =>
    res.jsend.success({
      list,
      next: list.length === +take ? +startsFrom + list.length : null,
    });

  if (type === 'following') {
    const following = (
      await prisma.follow.findMany({
        where: { userName },
        select: { followName: true },
        orderBy: { startFollowingAt: 'desc' },
        ...takeQuery,
      })
    ).map((follow) => Object.values(follow)[0]);

    send(following);
  } else if (type === 'follower') {
    const follower = (
      await prisma.follow.findMany({
        where: { followName: userName },
        select: { userName: true },
        orderBy: { startFollowingAt: 'desc' },
        ...takeQuery,
      })
    ).map((follow) => Object.values(follow)[0]);

    send(follower);
  } else {
    return next(new HttpException(400, 'wrong type'));
  }
}
