import { HttpException } from 'exceptions';
import prisma from 'resources/db';

import type { Request, Response, NextFunction } from 'express';
import { Report } from 'types';

export default async function (
  req: Request<any, Report>,
  res: Response,
  next: NextFunction
) {
  const userName = req.user;
  const { id, message } = req.body;

  try {
    await prisma.report.create({
      data: { questionId: id, message, authorName: userName },
    });

    res.jsend.success({});
  } catch (error) {
    return next(new HttpException(500, 'server error', error));
  }
}
