import { HttpException } from 'exceptions';
import prisma from 'resources/db';

import type { Request, Response, NextFunction } from 'express';
import type { RejectQuestion } from 'types/index';

export default async function (
  req: Request<any, any, RejectQuestion>,
  res: Response,
  next: NextFunction
) {
  const userName = req.user;
  const { questionId } = req.body;

  try {
    await prisma.question.update({
      where: {
        id_receiverName: {
          id: questionId,
          receiverName: userName,
        },
      },
      data: { status: 'rejected' },
    });

    res.jsend.success({});
  } catch (error) {
    if (error.code === 'P2025') {
      return next(new HttpException(400, 'wrong question id', error));
    }
    return next(new HttpException(500, 'server error', error));
  }
}
