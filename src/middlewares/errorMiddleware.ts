import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/httpException';

export const ErrorMiddleware = (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const status = error.status || 500;
    const message = error.message || 'Server error';

    response.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};
