import { Request, Response, NextFunction } from 'express';
import prisma from 'resources/db';
import { verify } from 'resources/token';

export default async function (
  { cookies: { refreshToken } }: Request,
  res: Response,
) {
  const userData = await prisma.profile.findFirst({
    where: { id: verify(refreshToken) },
    select: { email: true, name: true, image: true, userName: true },
    rejectOnNotFound: true,
  });

  res.jsend.success(userData);
};