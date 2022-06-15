import { HttpException } from 'exceptions';
import prisma from 'resources/db';

import type { Request, Response, NextFunction } from 'express';
import { LikeBody } from 'types';

export default async function (
  req: Request<any, any, LikeBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userName = req.user;
  const questionId = req.body.questionId;

  const updateLikeCount = async (increment: -1 | 1) =>
    await prisma.question.update({
      where: { id: questionId },
      data: { likeCount: { increment: increment } },
    });

  try {
    const liked: boolean = !!(await prisma.like.findFirst({
      where: { userName, questionId },
    }));

    if (liked) {
      await prisma.like.deleteMany({
        where: { questionId, userName },
      });
      await updateLikeCount(-1);
    } else {
      await prisma.like.create({
        data: { questionId, userName },
      });
      await updateLikeCount(1);
    }

    res.jsend.success({});
  } catch (error) {
    return next(new HttpException(400, 'wrong question id', error));
  }
}
