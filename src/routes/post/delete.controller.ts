import { HttpException } from 'exceptions';
import prisma from 'resources/db';

import type { Request, Response, NextFunction } from 'express';
import type { DeleteQuestion } from 'types';

export default async function (
  req: Request<any, any, DeleteQuestion>,
  res: Response,
  next: NextFunction
) {
  const userName = req.user;
  const { questionId } = req.body;

  try {
    await prisma.question.delete({
      where: {
        id_receiverName: {
          receiverName: userName,
          id: questionId,
        },
      },
    });

    res.jsend.success({});
  } catch (error) {
    if (error.code === 'P2025') {
      return next(new HttpException(400, 'bad request', error));
    }
    return next(new HttpException(500, 'server error', error));
  }
}
