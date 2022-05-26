import crypto from 'crypto';

export const createHash = (password: string): {hashPassword: string, salt: string} => {
  const passwordSalt = Math.random().toString(16).slice(2) + Math.random().toString(36).slice(2);
  const hashPassword = crypto.createHash('sha512').update(password + passwordSalt).digest('hex');

  return {
    hashPassword,
    salt: passwordSalt
  };
}

export const getHash = (password: string, salt: string) => {
  const hashPassword = crypto.createHash('sha512').update(password + salt).digest('hex');

  return hashPassword;
}