import xss from 'xss';
import prisma from 'resources/db';
import { HttpException } from 'exceptions/index';

import type { Request, Response, NextFunction } from 'express';
import type { QuestionBody } from 'types';

export default async function (
  req: Request<unknown, unknown, QuestionBody>,
  res: Response,
  next: NextFunction
) {
  const id = req.user;
  /**
   * @type {string} receiver - receiver's userName(unique value)
   * @type {string} post - question body
   * @type {(anonymous|onymous)} type
   */
  const { receiver, post, type } = req.body;

  try {
    const { id: receiverId } = await prisma.profile.findUnique({
      rejectOnNotFound: true,
      where: { userName: receiver },
      select: { id: true },
    });

    if (id === receiverId) {
      return next(new HttpException(400, 'wrong receiver'));
    }

    const newQuestionId: number =
      (await prisma.question.count({
        where: { receiverId },
      })) + 1;

    await prisma.question.create({
      data: {
        type,
        question: xss(post),
        receiverId,
        authorId: type === 'onymous' ? id : null,
        postId: newQuestionId,
      },
    });

    res.jsend.success({ id: newQuestionId });
  } catch (error) {
    if (error.code === 'P2003') {
      return next(new HttpException(400, 'invalid receiver id'));
    }

    next(new HttpException(500, 'server error', error));
  }
}
