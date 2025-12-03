import { ParamSchema } from 'express-validator';

export const userNameSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: 'Name must be a string',
  },
  trim: true,
  isLength: {
    options: { min: 1, max: 255 },
    errorMessage: 'Name must be between 1 and 255 characters',
  },
};

export const userDobSchema: ParamSchema = {
  optional: true,
  isISO8601: {
    errorMessage: 'Date of birth must be a valid date',
  },
};

export const userPhoneNumberSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: 'Phone number must be a string',
  },
  trim: true,
};

export const userAddressSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: 'Address must be a string',
  },
  trim: true,
};
