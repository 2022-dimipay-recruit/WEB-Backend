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
  const userName = req.user;
  console.log('name', userName);
  /**
   * @type {string} receiver - receiver's userName(unique value)
   * @type {string} post - question body
   * @type {(anonymous|onymous)} type
   */
  const { receiver, post, type } = req.body;

  try {
    if (receiver === userName) {
      return next(new HttpException(400, 'wrong receiver'));
    }

    const { id } = await prisma.question.create({
      data: {
        type,
        question: xss(post),
        receiverName: receiver,
        authorName: type === 'onymous' ? userName : null,
      },
      select: { id: true },
    });

    res.jsend.success({ id });
  } catch (error) {
    if (error.code === 'P2003') {
      return next(new HttpException(400, 'invalid receiver id', error));
    }

    next(new HttpException(500, 'server error', error));
  }
}
