import { HttpException } from 'exceptions'
import { Request, Response, NextFunction } from 'express'
import { Schema, ValidationError, ValidationErrorItem } from 'joi'

export default (joiScheme: Schema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await joiScheme.validateAsync(req.body)
    } catch (error) {
      const { details } = error as ValidationError
      const errorStack: ValidationErrorItem[] = []

      for (const item of details) {
        errorStack.push(item)
      }

      return next(
        new HttpException(400, 'invalid body', { detail: errorStack })
      )
    }
    next()
  }
