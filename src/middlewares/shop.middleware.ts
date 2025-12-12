import { checkSchema, ParamSchema } from 'express-validator';
import { validate } from '@utils';
import { shopNameSchema, shopDescriptionSchema, shopNameOptionalSchema, shopStatusSchema } from './validation-schemas';
import { TCreateShopRequestBody, TUpdateShopRequestBody } from '@models';

export const createShopBodyValidator = validate(
  checkSchema(
    {
      name: shopNameSchema,
      description: shopDescriptionSchema,
    } as Record<keyof TCreateShopRequestBody, ParamSchema>,
    ['body']
  )
);

export const updateShopBodyValidator = validate(
  checkSchema(
    {
      name: shopNameOptionalSchema,
      description: shopDescriptionSchema,
      status: shopStatusSchema,
    } as Record<keyof TUpdateShopRequestBody, ParamSchema>,
    ['body']
  )
);
