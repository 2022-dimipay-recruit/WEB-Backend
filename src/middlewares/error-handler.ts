import { NextFunction, Request, Response } from 'express';
import { HttpException } from 'exceptions';
import logger from 'resources/logger';

export default function (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data: unknown = error?.data;
  const { status, message } = error;

  logger.error({ message, data });
  res.status(status).jsend[status < 500 ? 'fail' : 'error']({ message });
}
