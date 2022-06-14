import prisma from 'resources/db';
import { HttpException } from 'exceptions';

import type { Request, Response, NextFunction } from 'express';
import type { UserParams } from 'types';
import { Status } from '@prisma/client';

export default async function (
  req: Request<UserParams>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userName = req.user;
  console.log(userName);

  try {
    const questions: { [key: string]: number } = {};
    for (const status of Object.keys(Status)) {
      questions[status] = await prisma.question.count({
        where: {
          receiverName: userName,
          status: status as Status,
        },
      });
    }

    const userInformation = await prisma.profile.findUnique({
      where: { userName },
      select: {
        email: true,
        name: true,
        image: true,
        userName: true,
      },
    });

    res.jsend.success({ questions: { ...questions }, ...userInformation });
  } catch (error) {
    return next(new HttpException(500, 'server error', error));
  }
}
