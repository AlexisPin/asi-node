import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export default class AppMiddleware {
  static notFound(req: Request, res: Response, next: NextFunction) {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  }

  static errorHandler(
    error: Error,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
  ) {
    if (error instanceof ZodError) {
      res.status(422).json({ message: error.issues });
      return;
    }
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: error.message,
      stack: process.env['NODE_ENV'] === 'production' ? '🥞' : error.stack,
    });
  }
}
