import addNotification from 'resources/addNotification';
import { HttpException } from 'exceptions';
import prisma from 'resources/db';
import liked from 'resources/liked';

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
    if (await liked(userName, questionId)) {
      await prisma.like.deleteMany({
        where: { questionId, userName },
      });
      await updateLikeCount(-1);
    } else {
      await prisma.like.create({
        data: { questionId, userName },
      });
      await updateLikeCount(1);

      // add notification
      const question = await prisma.question.findUnique({
        where: { id: questionId },
        select: { question: true, author: true, receiver: true, status: true },
      });

      if (question.author) {
        await addNotification(
          question.author.userName,
          `'${userName}'님이 '${question.question}'질문에 좋아요를 눌렀어요`
        );
      }

      if (question.status === 'accepted') {
        await addNotification(
          question.receiver.userName,
          `'${userName}'님이 '${question.question}'답변에 좋아요를 눌렀어요`
        );
      }
    }

    res.jsend.success({});
  } catch (error) {
    return next(new HttpException(400, 'wrong question id', error));
  }
}
