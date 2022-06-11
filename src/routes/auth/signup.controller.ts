import { Request, Response, NextFunction } from 'express';
import { Prisma, Profile, User } from '@prisma/client';
import prisma from 'resources/db';
import { HttpException } from 'exceptions';
import { createSalt, getHash } from 'resources/hash';
import { signTokens } from 'resources/token';

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, userName, name, password } = req.body as Profile &
    Pick<User, 'password'>;

  if (await isUniqeProfile('email', email)) {
    return next(new HttpException(409, '이미 존재하는 이메일입니다.'));
  }

  if (await isUniqeProfile('userName', userName)) {
    return next(new HttpException(409, '이미 존재하는 이름입니다.'));
  }

  const salt: string = createSalt();
  const pbkdf2Password: string = getHash(password, salt);

  const { id }: User = await prisma.user.create({
    data: {
      password: pbkdf2Password,
      salt,
      profile: { create: { email, userName, name } },
    },
  });

  signTokens(res, id);
}

const isUniqeProfile = async <T extends keyof Prisma.ProfileWhereUniqueInput>(
  unique: T,
  value: Prisma.ProfileWhereUniqueInput[T]
): Promise<Boolean> =>
  !!(await prisma.profile.findUnique({
    where: { [unique]: value },
  }));
