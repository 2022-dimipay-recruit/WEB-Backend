import sharp from 'sharp';
import axios from 'axios';
import config from 'config';

export default async function (buffer: Buffer): Promise<string> {
  try {
    const resizedImage = await sharp(buffer).resize(100, 100).toBuffer();
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
    return url;
  } catch (error) {
    throw error;
  }
}
