import { HttpException } from 'exceptions/index';
import { verify } from 'resources/token';
import prisma from 'resources/db';
import { JsonWebTokenError } from 'jsonwebtoken';
import liked from 'resources/liked';

import type { Request, Response, NextFunction } from 'express';
import type { FollowingFeed, RandomFeed } from 'types';

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authorization = req.headers.authorization;
    const userName = authorization ? verify(authorization.split(' ')[1]) : null;

    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const feeds: { [key: string]: any } = {};

    if (userName) {
      const followingFeed: FollowingFeed = (
        await prisma.follow.findMany({
          where: { userName },
          select: {
            follower: {
              select: {
                userName: true,
                name: true,
                image: true,
              },
            },
            following: {
              select: {
                received: {
                  where: {
                    status: 'accepted',
                    answerAt: { gte: today },
                  },
                  select: {
                    id: true,
                    createAt: true,
                    question: true,
                    answer: true,
                    authorName: true,
                    likeCount: true,
                  },
                },
              },
            },
          },
        })
      ).filter(({ following: { received } }) => received.length);

      for (const {
        following: { received },
      } of followingFeed) {
        for (const post of received) {
          post['liked'] = await liked(userName, post.id);
        }
      }

      feeds['followingFeed'] = followingFeed;
    }

    const randomFeed: RandomFeed = await prisma.question.findMany({
      where: {
        status: 'accepted',
        answerAt: { gte: today },
      },
      select: {
        id: true,
        createAt: true,
        question: true,
        answer: true,
        authorName: true,
        likeCount: true,
        receiver: {
          select: {
            userName: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { answerAt: 'asc' },
      take: 10,
    });

    // attatch liked key
    if (userName) {
      for (const feed of randomFeed) {
        feed['liked'] = await liked(userName, feed.id);
      }
    }

    feeds['randomFeed'] = randomFeed;

    res.jsend.success(feeds);
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return next(new HttpException(401, 'wrong tokwn', error));
    }
    return next(new HttpException(500, 'server error', error));
  }
}
