import { checkSchema, ParamSchema, Schema } from 'express-validator';
import { validate } from '@utils';
import { AuthorizationSchema, refreshTokenCookieSchema } from './validation-schemas';
import { AUTH_MESSAGES } from '@constants';
import { TLoginRequestBody, TRegisterRequestBody } from '@models';

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: AuthorizationSchema,
    },
    ['headers']
  )
);

export const refreshTokenCookieValidator = validate(
  checkSchema(
    {
      refreshToken: refreshTokenCookieSchema,
    },
    ['cookies']
  )
);

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: AUTH_MESSAGES.EMAIL_IS_REQUIRED,
        },
        isEmail: {
          errorMessage: AUTH_MESSAGES.EMAIL_MUST_BE_VALID,
        },
      },
      password: {
        notEmpty: {
          errorMessage: AUTH_MESSAGES.PASSWORD_IS_REQUIRED,
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
          errorMessage: AUTH_MESSAGES.NAME_IS_REQUIRED,
        },
      },
      email: {
        notEmpty: {
          errorMessage: AUTH_MESSAGES.EMAIL_IS_REQUIRED,
        },
        isEmail: {
          errorMessage: AUTH_MESSAGES.EMAIL_MUST_BE_VALID,
        },
      },
      password: {
        notEmpty: {
          errorMessage: AUTH_MESSAGES.PASSWORD_IS_REQUIRED,
        },
        isLength: {
          options: { min: 6, max: 50 },
          errorMessage: AUTH_MESSAGES.PASSWORD_MUST_BE_FROM_6_TO_50_CHARACTERS,
        },
      },
      address: {
        notEmpty: {
          errorMessage: AUTH_MESSAGES.ADDRESS_IS_REQUIRED,
        },
      },
      phone_number: {
        notEmpty: {
          errorMessage: AUTH_MESSAGES.PHONE_NUMBER_IS_REQUIRED,
        },
      },
      dob: {
        notEmpty: {
          errorMessage: AUTH_MESSAGES.DOB_IS_REQUIRED,
        },
        isISO8601: {
          errorMessage: AUTH_MESSAGES.DOB_MUST_BE_VALID_DATE,
        },
      },
    } as Record<keyof TRegisterRequestBody, ParamSchema>,
    ['body']
  )
);
