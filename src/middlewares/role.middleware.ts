import { checkSchema, ParamSchema } from 'express-validator';
import { validate } from '@utils';
import { roleNameSchema, roleCodeSchema, roleDescriptionSchema, roleNameOptionalSchema } from './validation-schemas';
import { TCreateRoleRequestBody, TUpdateRoleRequestBody } from '@models';

export const createRoleBodyValidator = validate(
  checkSchema(
    {
      name: roleNameSchema,
      code: roleCodeSchema,
      description: roleDescriptionSchema,
    } as Record<keyof TCreateRoleRequestBody, ParamSchema>,
    ['body']
  )
);

export const updateRoleBodyValidator = validate(
  checkSchema(
    {
      name: roleNameOptionalSchema,
      description: roleDescriptionSchema,
    } as Record<keyof TUpdateRoleRequestBody, ParamSchema>,
    ['body']
  )
);
