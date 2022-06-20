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
    const allowDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - 3
    );

    const feeds: { [key: string]: any } = {};
    const followingFeedIdMemo: string[] = [];

    // following feed
    if (userName) {
      // userName === following
      const followingFeed: FollowingFeed = (
        await prisma.follow.findMany({
          where: { userName }, // everyone followed by userName -> follower
          select: {
            follower: {
              select: {
                userName: true,
                email: true,
                name: true,
                image: true,
                received: {
                  where: {
                    status: 'accepted',
                    answerAt: { gte: allowDay },
                  },
                  select: {
                    id: true,
                    createAt: true,
                    answerAt: true,
                    type: true,
                    question: true,
                    answer: true,
                    authorName: true,
                    likeCount: true,
                  },
                  orderBy: { answerAt: 'desc' },
                },
              },
            },
          },
        })
      ).filter(({ follower: { received } }) => {
        if (received.length) {
          // memo for random feed overlap check
          for (const { id } of received) {
            followingFeedIdMemo.push(id);
          }
          return true;
        }
        return false;
      });

      // attatch liked and remove author
      for (const {
        follower: { received },
      } of followingFeed) {
        for (const post of received) {
          if (post.type === 'anonymous') {
            post.authorName = null;
          }
          post['liked'] = await liked(userName, post.id);
        }
      }

      feeds['followingFeed'] = followingFeed;
    }

    // random feed
    let randomFeed: RandomFeed = await prisma.question.findMany({
      where: {
        status: 'accepted',
        answerAt: { gte: allowDay },
      },
      select: {
        id: true,
        createAt: true,
        question: true,
        answer: true,
        authorName: true,
        likeCount: true,
        answerAt: true,
        receiver: {
          select: {
            userName: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { answerAt: 'desc' },
      take: 10,
    });

    if (userName) {
      // remove overlap feed
      randomFeed = randomFeed.filter(
        (feed) => !followingFeedIdMemo.includes(feed.id)
      );

      // attatch liked key
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
