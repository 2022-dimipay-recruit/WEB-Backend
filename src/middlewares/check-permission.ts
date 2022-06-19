import { NextFunction, Request, Response } from 'express';
import { HttpException } from 'exceptions';
import { verify } from 'resources/token';

export default function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    if (!req.needAuth) {
      return next();
    }

    const token = req.headers.authorization.split(' ')[1];

    req.user = verify(token);
    return next();
  } catch (error) {
    next(new HttpException(401, 'wrong token', error));
  }
}
