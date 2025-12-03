import { checkSchema, ParamSchema } from 'express-validator';
import { validate } from '@utils';
import { userNameSchema, userDobSchema, userPhoneNumberSchema, userAddressSchema } from './validation-schemas';
import { TUpdateUserRequestBody } from '@models';

export const updateUserBodyValidator = validate(
  checkSchema(
    {
      name: userNameSchema,
      dob: userDobSchema,
      phone_number: userPhoneNumberSchema,
      address: userAddressSchema,
    } as Record<keyof TUpdateUserRequestBody, ParamSchema>,
    ['body']
  )
);
