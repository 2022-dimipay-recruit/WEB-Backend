import { Request, Response } from 'express'
import { verify, signTokens } from 'resources/token'

export default function (
  { cookies: { refreshTOken } }: Request,
  res: Response
): void {
  signTokens(res, verify(refreshTOken))
}
