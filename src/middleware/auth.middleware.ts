import { checkSchema } from 'express-validator';
import { validate } from '@utils';
import { AuthorizationSchema, refreshTokenCookieSchema } from './validation-schemas';
import { AUTH_MESSAGES } from '@constants';

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
    },
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
      tenant_id: {
        notEmpty: {
          errorMessage: AUTH_MESSAGES.TENANT_ID_IS_REQUIRED,
        },
      },
    },
    ['body']
  )
);
