import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import config from 'config';

export function sign(id: User['id'], refresh = false): string {
  return jwt.sign(
    Object.assign({ id }, refresh ? { refresh: true } : {}),
    config.jwtSecret,
    {
      expiresIn: refresh ? '1y' : '10min',
    }
  );
}

export function verify(token: string, refresh = false): User['id'] {
  if (refresh) {
    const decode = jwt.verify(token, config.jwtSecret) as {
      id: User['id'];
      refresh: boolean;
    };
    if (decode.refresh !== true) throw 'wrong token';
    return decode.id;
  }
  return (jwt.verify(token, config.jwtSecret) as { id: User['id'] }).id;
}

export const signTokens = (res: Response, id: User['id']): void => {
  res.cookie('refreshToken', sign(id, true), {
    httpOnly: true,
    // secure: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 365.25,
  });
  res.jsend.success({ accessToken: sign(id) });
};
