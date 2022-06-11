import { Request, Response, NextFunction } from 'express';
import prisma from 'resources/db';
import { HttpException } from 'exceptions';
import { getHash } from 'resources/hash';
import { signTokens } from 'resources/token';

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { email, password } = req.body as { [k: string]: string };

  try {
    const { id, salt } = await prisma.user.findFirst({
      where: { profile: { email } },
      select: { id: true, salt: true },
      rejectOnNotFound: true,
    });

    await prisma.user.findFirst({
      where: {
        id,
        password: getHash(password, salt),
      },
      rejectOnNotFound: true,
    });

    signTokens(res, id);
  } catch (error) {
    return next(new HttpException(401, 'login fail', error));
  }
}
