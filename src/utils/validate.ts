import { HTTP_STATUS } from '@constants/http';
import { EntityError, ErrorWithStatus } from '@models';
import { NextFunction, Request, Response } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema';

/**
 * Middleware to run express-validator validations and handle errors
 * @param validations Array of validation chains
 * @returns Express middleware function
 */
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req);
    const errors = validationResult(req);
    const errorsObject = errors.mapped();
    const entityErrors = new EntityError({ errors: {} });

    //If there are no errors, continue to the next middleware
    if (errors.isEmpty()) {
      return next();
    }
    //If there are errors, check if there is an error with status not equal 422
    for (const key in errorsObject) {
      const { msg } = errorsObject[key];
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg);
      }
      entityErrors.errors[key] = errorsObject[key];
    }
    next(entityErrors);
  };
};
