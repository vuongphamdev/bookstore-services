import { ParamSchema } from 'express-validator';
import { ERole } from '@constants';

export const roleNameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Role name is required',
  },
  isString: {
    errorMessage: 'Role name must be a string',
  },
  trim: true,
  isLength: {
    options: { min: 1, max: 100 },
    errorMessage: 'Role name must be between 1 and 100 characters',
  },
};

export const roleCodeSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Role code is required',
  },
  isIn: {
    options: [[ERole.ADMIN, ERole.USER, ERole.GUEST]],
    errorMessage: 'Invalid role code',
  },
};

export const roleDescriptionSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: 'Role description must be a string',
  },
  trim: true,
};

// Optional schemas for update operations
export const roleNameOptionalSchema: ParamSchema = {
  optional: true,
  ...roleNameSchema,
};
