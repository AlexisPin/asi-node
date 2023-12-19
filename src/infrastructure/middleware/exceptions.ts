import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';


export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    res.status(422).json({ message: error.flatten() });
    return;
  }
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: error.message,
    stack: process.env['NODE_ENV'] === 'production' ? '🥞' : error.stack
  })
    ;
}
