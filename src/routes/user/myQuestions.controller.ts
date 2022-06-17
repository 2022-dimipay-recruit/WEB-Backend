import prisma from 'resources/db';
import { HttpException } from 'exceptions';

import type { Request, Response, NextFunction } from 'express';

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userName = req.user;

  try {
    const questions = await prisma.question.findMany({
      where: { authorName: userName },
      select: {
        createAt: true,
        type: true,
        status: true,
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

    res.jsend.success([...questions]);
  } catch (error) {
    return next(new HttpException(500, 'server error', error));
  }
}
