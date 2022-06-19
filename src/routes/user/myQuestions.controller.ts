import prisma from 'resources/db';
import { HttpException } from 'exceptions';
import liked from 'resources/liked';

import type { Request, Response, NextFunction } from 'express';
import type { QuestionList } from 'types';

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userName = req.user;

  try {
    const questions: QuestionList = await prisma.question.findMany({
      where: { authorName: userName, status: 'accepted' },
      select: {
        id: true,
        createAt: true,
        type: true,
        question: true,
        answer: true,
        receiver: {
          select: {
            userName: true,
            image: true,
            name: true,
          },
        },
        likeCount: true,
      },
    });

    for (const question of questions) {
      question['liked'] = await liked(userName, question.id);
    }

    res.jsend.success([...questions]);
  } catch (error) {
    return next(new HttpException(500, 'server error', error));
  }
}
