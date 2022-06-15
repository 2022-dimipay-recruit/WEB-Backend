import { verify } from 'resources/token';
import { HttpException } from 'exceptions/index';
import { Status } from '@prisma/client';
import prisma from 'resources/db';
import { TokenExpiredError } from 'jsonwebtoken';

import type { Request, Response, NextFunction } from 'express';
import type { UserParams, UserQuestionQuery } from 'types';

export default async function (
  req: Request<UserParams, any, any, UserQuestionQuery>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userName = req.params.name;
  const { type = 'received', itemsPerPage = 4, page = 1 } = req.query;

  if (!Object.keys(Status).includes(type)) {
    return next(new HttpException(400, 'wrong type'));
  }

  try {
    const normalizedItemsPerPage: number = +itemsPerPage | 0;
    const normalizedPage: number = +page;

    const questionQuery = { receiverName: userName, status: type as Status };
    const questionLength: number = await prisma.question.count({
      where: questionQuery,
    });

    const maxPage: number = Math.ceil(questionLength / normalizedItemsPerPage);

    if (
      normalizedPage < 0 ||
      normalizedItemsPerPage < 0 ||
      normalizedItemsPerPage * maxPage < normalizedPage
    ) {
      return next(new HttpException(400, 'wrong page input'));
    }

    const questions = await prisma.question.findMany({
      where: questionQuery,
      select: {
        id: true,
        question: true,
        answer: true,
        authorName: true,
        createAt: true,
        likeCount: true,
      },
      skip: normalizedItemsPerPage * (normalizedPage - 1),
      take: normalizedItemsPerPage,
      orderBy: { createAt: 'desc' },
    });

    const bearerToken: string = req.headers.authorization;

    if (bearerToken) {
      const currentUserName: string = verify(bearerToken.split(' ')[1]);
      const result: (typeof questions[0] & { liked: boolean })[] = [];

      for (const question of questions) {
        const liked = await prisma.like.findFirst({
          where: { questionId: question.id, userName: currentUserName },
        });

        result.push({ ...question, liked: liked !== null });
      }

      res.jsend.success({ question: [...result], maxPage });
      return;
    }
    res.jsend.success({ question: [...questions], maxPage });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new HttpException(401, 'expired token', error));
    }
    return next(new HttpException(500, 'server error', error));
  }
}
