import xss from 'xss';
import prisma from 'resources/db';
import { HttpException } from 'exceptions/index';
import { verify } from 'resources/token';

import type { Request, Response, NextFunction } from 'express';
import type { QuestionBody } from 'types';
import { JsonWebTokenError } from 'jsonwebtoken';

export default async function (
  req: Request<any, any, QuestionBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers.authorization;
    const userName = authorization ? verify(authorization.split(' ')[1]) : null;

    const { receiver, post, type } = req.body;

    if (receiver === userName) {
      return next(new HttpException(400, 'wrong receiver'));
    }

    const { id } = await prisma.question.create({
      data: {
        type,
        question: xss(post),
        receiverName: receiver,
        authorName: userName ? (type === 'onymous' ? userName : null) : null,
      },
      select: { id: true },
    });

    res.jsend.success({ id });
  } catch (error) {
    if (error.code === 'P2003') {
      return next(new HttpException(400, 'invalid receiver id', error));
    }

    if (error instanceof JsonWebTokenError) {
      return next(new HttpException(401, 'wrong token', error));
    }

    next(new HttpException(500, 'server error', error));
  }
}
