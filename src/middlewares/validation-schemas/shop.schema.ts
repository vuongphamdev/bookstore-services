import { ParamSchema } from 'express-validator';
import { EShopStatus } from '@constants';

export const shopNameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Shop name is required',
  },
  isString: {
    errorMessage: 'Shop name must be a string',
  },
  trim: true,
  isLength: {
    options: { min: 1, max: 255 },
    errorMessage: 'Shop name must be between 1 and 255 characters',
  },
};

export const shopDescriptionSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: 'Shop description must be a string',
  },
  trim: true,
};

export const shopStatusSchema: ParamSchema = {
  optional: true,
  isIn: {
    options: [[EShopStatus.ACTIVE, EShopStatus.INACTIVE, EShopStatus.SUSPENDED, EShopStatus.CLOSED]],
    errorMessage: 'Invalid shop status',
  },
};

// Optional schemas for update operations
export const shopNameOptionalSchema: ParamSchema = {
  optional: true,
  ...shopNameSchema,
};
