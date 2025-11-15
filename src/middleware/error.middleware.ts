import { GENERAL_MESSAGE } from '@constants';
import { HTTP_STATUS } from '@constants/http';
import { EntityError, ErrorWithStatus, Responses } from '@models';
import { Request, Response } from 'express';

export const defaultErrorHandler = (err: any, req: Request, res: Response) => {
  try {
    if (err instanceof EntityError) {
      return Responses.entityError(res, err);
    } else if (err instanceof ErrorWithStatus) {
      return Responses.error(res, err);
    }
    return Responses.error(
      res,
      new ErrorWithStatus({
        message: err.message || GENERAL_MESSAGE.INTERNAL_SERVER_ERROR,
        status: err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      })
    );
  } catch (error) {
    console.error(error);
    return Responses.error(
      res,
      new ErrorWithStatus({
        message: GENERAL_MESSAGE.INTERNAL_SERVER_ERROR,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      })
    );
  }
};
