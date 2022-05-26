import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  User,
  UserIdentity,
  Account
} from '../../interfaces';
import { HttpException } from '../../exceptions';
import { issue as issueToken, verify, getTokenType } from '../../resources/token';
import {
  createHash,
  getHash
} from '../../resources/hash';

const prisma = new PrismaClient();

const getEntireIdentity = async (id: number) => {
  const identity: UserIdentity = await prisma.users.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      profile: true
    }
  })
  return identity;
};

export const identifyUser = async (req: Request, res: Response) => {
  const account: Account = req.body;

  try{
    const user = await prisma.users.findUnique({
      where: {
        username: account.username
      },
      select: {
        id: true,
        salt: true,
        password: true
      }
    });
    if(!user) throw new HttpException(401, '로그인에 실패했습니다.');
  
    const hashPassword = getHash(account.password, user.salt);
    if(user.password === hashPassword) {
      const identity = await getEntireIdentity(user.id);
      res.json({
        accessToken: await issueToken(identity, false),
        refreshToken: await issueToken(identity, true),
      });
    } else throw new HttpException(401, '로그인에 실패했어요.');
  }  catch (error) {
    if (error.name === 'HttpException') throw error;
    throw new HttpException(401, '인증에 실패했습니다.');
  }
}

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password, name } = req.body;
  const [existence]: Array<User> = await prisma.users.findMany({
    where: {
      OR: [
        {
          email
        },
        {
          username
        }
      ]
    }
  });
  if(existence) throw new HttpException(401, '이미 존재하는 회원입니다.');
  
  const {hashPassword, salt} = createHash(password);

  const user = await prisma.users.create({
    data: {
      username,
      email,
      password: hashPassword,
      name,
      salt
    },
    select: {
      name: true
    }
  });
  res.json({user});
}

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { token: refreshToken } = req;
  if (!refreshToken) throw new HttpException(400, '리프레시 토큰이 전달되지 않았습니다.');

  const tokenType = await getTokenType(refreshToken);
  if (tokenType !== 'REFRESH') throw new HttpException(400, '리프레시 토큰이 아닙니다.');

  const payload = await verify(refreshToken);
  const identity = await getEntireIdentity(payload.idx);
  res.json({
    accessToken: await issueToken(identity, false),
    refreshToken: await issueToken(identity, true),
  });
}