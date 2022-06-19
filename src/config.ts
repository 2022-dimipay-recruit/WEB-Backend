import dotenv from 'dotenv';

const env = dotenv.config();
if (!env) throw new Error('No env file found');

export default {
  port: process.env.PORT!,
  jwtSecret: process.env.JWT_SECRET!,
  cookieSecret: process.env.COOKIE_SECRET!,
  imgbbApi: process.env.IMAGEBB_API!,
};
