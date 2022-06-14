import { Request, Response } from 'express';
import { verify, signTokens } from 'resources/token';

export default function (req: Request, res: Response): void {
  const refreshToken = req.headers.authorization.split(' ')[1];
  signTokens(res, verify(refreshToken));
}
