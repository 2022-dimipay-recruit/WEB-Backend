import prisma from 'resources/db';
import { HttpException } from 'exceptions';
import addNotification from 'resources/addNotification';

import type { Request, Response, NextFunction } from 'express';
import type { AsnwerBody } from 'types';

export default async function (
  req: Request<unknown, unknown, AsnwerBody>,
  res: Response,
  next: NextFunction
) {
  const { questionId, post } = req.body;

  try {
    const update = await prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        answer: post,
        status: 'accepted',
        answerAt: new Date(),
      },
      select: {
        author: true,
        question: true,
      },
    });

    // add notification
    if (update.author) {
      await addNotification(
        update.author.userName,
        `상대방이 나의 ${update.question}질문에 답변해줬어요`,
        post
      );
    }

    res.jsend.success({});
  } catch (error) {
    next(new HttpException(500, 'server error', error));
  }
}
