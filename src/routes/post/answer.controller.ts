import prisma from 'resources/db';
import { HttpException } from 'exceptions';

import type { Request, Response, NextFunction } from 'express';
import type { AsnwerBody } from 'types';

export default async function (
  req: Request<unknown, unknown, AsnwerBody>,
  res: Response,
  next: NextFunction
) {
  const { questionId, post } = req.body;

  try {
    const { count } = await prisma.question.updateMany({
      where: {
        OR: [
          { id: questionId, status: 'received' },
          { id: questionId, status: 'accepted' },
        ],
      },
      data: {
        answer: post,
        status: 'accepted',
        answerAt: new Date(),
      },
    });

    if (count === 0) {
      return next(new HttpException(400, 'bad request'));
    }

    res.jsend.success({});
  } catch (error) {
    next(new HttpException(500, 'server error', error));
  }
}
