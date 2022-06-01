import { randomBytes, pbkdf2Sync, BinaryLike } from 'crypto'

export const createSalt = (): string => randomBytes(16).toString('hex')
export const getHash = (password: BinaryLike, salt: BinaryLike): string =>
  pbkdf2Sync(password, salt, 20000, 64, 'sha256').toString('hex')
