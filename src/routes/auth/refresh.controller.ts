import { HttpException } from 'exceptions/index'
import { Request, Response, NextFunction } from 'express'
import { verify, signTokens } from 'resources/token'

export default function (
  { cookies: { refreshToken } }: Request,
  res: Response,
  next: NextFunction
): void {
  if (typeof refreshToken === 'undefined') {
    return next(new HttpException(400, 'wrong token'))
  }
  signTokens(res, verify(refreshToken))
}
