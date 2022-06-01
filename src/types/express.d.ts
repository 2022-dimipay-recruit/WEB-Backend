import { User } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      user?: User['id']
      needAuth: boolean
    }
  }
}
