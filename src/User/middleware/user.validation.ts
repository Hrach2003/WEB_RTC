import { Request, Response, NextFunction } from 'express'
import { ValidationError, validationResult, Result, check } from 'express-validator'


export const userValidation = [
  check('email', 'incorrect email').exists().isEmail(),
  check('password', 'minimum length is 6').exists().isLength({ min: 6 })
]

export const checkErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors: Result<ValidationError> = validationResult(req.body)
  if (!errors.isEmpty()) 
    return res.status(400).json({
      error: errors.array(),
      message: "error"
    });
  next()
}