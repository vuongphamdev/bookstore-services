import { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Async wrapper for Express route handlers
 * Automatically catches async errors and passes them to error middleware
 */
export const WrapAsync = (func: RequestHandler<any, any, any, any>) => {
  return async (req: Request<any>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
