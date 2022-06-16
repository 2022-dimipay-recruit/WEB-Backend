import prisma from 'resources/db';
import { HttpException } from 'exceptions';

import type { Request, Response, NextFunction } from 'express';
import type { AsnwerBody } from 'types';

export default async function (
  req: Request<unknown, unknown, AsnwerBody>,
  res: Response,
  next: NextFunction
) {
  const { questionId, post, status } = req.body;

  try {
    const { count } = await prisma.question.updateMany({
      where: { id: questionId, status: 'received' },
      data: {
        answer: status === 'accepted' ? post : '',
        status,
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
