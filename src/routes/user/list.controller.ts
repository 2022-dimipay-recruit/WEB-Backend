import { HttpException } from 'exceptions/index';
import { Status } from '@prisma/client';
import prisma from 'resources/db';

import type { Request, Response, NextFunction } from 'express';
import type { UserParams, UserQuestionQuery } from 'types';

export default async function (
  req: Request<UserParams, any, any, UserQuestionQuery>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { type = 'received', itemsPerPage = 4, page = 1 } = req.query;

  if (!Object.keys(Status).includes(type)) {
    return next(new HttpException(400, 'wrong type'));
  }

  try {
    const questions = await prisma.question.findMany({
      where: { receiverName: req.params.name, status: type as Status },
      select: {
        question: true,
        answer: true,
        authorName: true,
        createAt: true,
        likeCount: true,
      },
      orderBy: { createAt: 'desc' },
    });

    const normalizedItemsPerPage = +itemsPerPage | 0;
    const normalizedPage = +page;

    if (
      normalizedPage < 0 ||
      normalizedItemsPerPage < 0 ||
      normalizedItemsPerPage * (normalizedPage - 1) > questions.length
    ) {
      return next(new HttpException(400, 'wrong page input'));
    }

    res.jsend.success({
      question: questions.splice(
        normalizedItemsPerPage * (normalizedPage - 1),
        normalizedItemsPerPage
      ),
      maxPage: Math.ceil(questions.length / normalizedItemsPerPage),
    });
  } catch (error) {
    return next(new HttpException(500, 'server error', error));
  }
}
