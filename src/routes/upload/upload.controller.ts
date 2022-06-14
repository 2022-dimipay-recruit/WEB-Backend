import config from 'config';
import sharp from 'sharp';
import prisma from 'resources/db';
import axios from 'axios';
import { HttpException } from 'exceptions/index';

import type { Request, Response, NextFunction } from 'express';

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const resizedImage = await sharp(req.file.buffer)
      .resize(200, 200)
      .toBuffer();

    const {
      data: {
        data: { url },
      },
    } = await axios({
      method: 'POST',
      url: `https://api.imgbb.com/1/upload?key=${config.imgbbApi}`,
      data: {
        image: resizedImage.toString('base64'),
      },
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    await prisma.profile.update({
      where: { userName: req.user },
      data: { image: url },
    });

    res.jsend.success({});
  } catch (error) {
    console.log(error);
    return next(new HttpException(400, 'fail to update image', error));
  }
}
