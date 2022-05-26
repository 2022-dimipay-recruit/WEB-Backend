import jwt from 'jsonwebtoken';
import { User, UserIdentity } from '../interfaces';
import config from '../config';
import { HttpException } from '../exceptions';
import { TokenType } from '../types';

export const getTokenType = async (token: string): Promise<TokenType> => {
  try {
    const payload: any = await jwt.verify(
      token,
      config.jwtSecret as string,
    );
    return (
      payload.refresh
        ? 'REFRESH' : 'ACCESS'
    );
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new HttpException(401, '토큰이 만료되었습니다.');
    } else if (['jwt malformed', 'invalid signature'].includes(error.message)) {
      throw new HttpException(401, '토큰이 변조되었습니다.');
    } else throw new HttpException(401, '토큰에 문제가 있습니다.');
  }
};

export const verify = async (token: string) => {
  try {
    const { identity }: any = await jwt.verify(
      token,
      config.jwtSecret as string,
    );
    return identity;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new HttpException(401, '토큰이 만료되었습니다.');
    } else if (['jwt malformed', 'invalid signature'].includes(error.message)) {
      throw new HttpException(401, '토큰이 변조되었습니다.');
    } else throw new HttpException(401, '토큰에 문제가 있습니다.');
  }
};

export const issue = async (identity: UserIdentity, refresh: boolean) => {
  if (refresh) {
    const token = await jwt.sign(
      {
        identity: {
          id: identity.id,
        },
        refresh: true,
      },
      config.jwtSecret as string,
      {
        algorithm: 'HS512',
        expiresIn: '1y',
      },
    );
    return token;
  }
  const token = await jwt.sign(
    {
      identity,
      refresh: false,
    },
    config.jwtSecret as string,
    {
      algorithm: 'HS512',
      expiresIn: '1w',
    },
  );
  return token;
};