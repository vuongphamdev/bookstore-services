import { checkSchema, ParamSchema } from 'express-validator';
import { validate } from '@utils';
import { TLoginRequestBody, TRegisterRequestBody } from '@models';

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: 'Email is required',
        },
        isEmail: {
          errorMessage: 'Email must be valid',
        },
      },
      password: {
        notEmpty: {
          errorMessage: 'Password is required',
        },
      },
    } as Record<keyof TLoginRequestBody, ParamSchema>,
    ['body']
  )
);

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: 'Name is required',
        },
      },
      email: {
        notEmpty: {
          errorMessage: 'Email is required',
        },
        isEmail: {
          errorMessage: 'Email must be valid',
        },
      },
      password: {
        notEmpty: {
          errorMessage: 'Password is required',
        },
        isLength: {
          options: { min: 6, max: 50 },
          errorMessage: 'Password must be from 6 to 50 characters',
        },
      },
      address: {
        notEmpty: {
          errorMessage: 'Address is requisred',
        },
      },
      phone_number: {
        notEmpty: {
          errorMessage: 'Phone number is required',
        },
      },
      dob: {
        notEmpty: {
          errorMessage: 'DOB is required',
        },
        isISO8601: {
          errorMessage: 'DOB must be valid date',
        },
      },
    } as Record<keyof TRegisterRequestBody, ParamSchema>,
    ['body']
  )
);
