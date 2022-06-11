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
  const { receiver, question, type } = req.body;

  if (id === receiver) {
    return next(new HttpException(400, 'wrong receiver'));
  }

  try {
    const questionLength: number = await prisma.question.count({
      where: { receiverId: receiver },
    });
    const newQuestionId: number = questionLength + 1;

    await prisma.question.create({
      data: {
        type,
        question: xss(question),
        receiverId: receiver,
        authorId: type === 'onymous' ? null : id,
        postId: newQuestionId,
      },
    });

    res.jsend.success({ id: newQuestionId });
  } catch (error) {
    /** @see https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes */
    if (error.code === 'P2003') {
      return next(new HttpException(400, 'invalid receiver id'));
    }

    next(new HttpException(500, 'server error', error));
  }
}
