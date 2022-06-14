import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { Profile } from '@prisma/client';
import config from 'config';

export function sign(id: any, refresh = false): string {
  return jwt.sign(
    Object.assign({ id }, refresh ? { refresh: true } : {}),
    config.jwtSecret,
    {
      expiresIn: refresh ? '1y' : '10min',
    }
  );
}

export function verify(token: string, refresh = false): Profile['userName'] {
  if (refresh) {
    const decode = jwt.verify(token, config.jwtSecret) as {
      name: Profile['userName'];
      refresh: boolean;
    };
    if (decode.refresh !== true) throw 'wrong token';
    return decode.name;
  }
  return (jwt.verify(token, config.jwtSecret) as { id: Profile['userName'] })
    .id;
}

export const signTokens = (res: Response, name: Profile['userName']): void => {
  res.cookie('refreshToken', sign(name, true), {
    httpOnly: true,
    // secure: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 365.25,
  });
  res.jsend.success({ accessToken: sign(name) });
};
