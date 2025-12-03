import { ParamSchema } from 'express-validator';
import { EProductStatus } from '@constants';

export const productNameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Product name is required',
  },
  isString: {
    errorMessage: 'Product name must be a string',
  },
  trim: true,
  isLength: {
    options: { min: 1, max: 255 },
    errorMessage: 'Product name must be between 1 and 255 characters',
  },
};

export const productSkuSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Product SKU is required',
  },
  isString: {
    errorMessage: 'Product SKU must be a string',
  },
  trim: true,
  isLength: {
    options: { min: 1, max: 100 },
    errorMessage: 'Product SKU must be between 1 and 100 characters',
  },
};

export const productCategorySchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Product category is required',
  },
  isString: {
    errorMessage: 'Product category must be a string',
  },
  trim: true,
};

export const productDescriptionSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: 'Product description must be a string',
  },
  trim: true,
};

export const productPriceSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Product price is required',
  },
  isFloat: {
    options: { min: 0 },
    errorMessage: 'Product price must be a positive number',
  },
  toFloat: true,
};

export const productStockSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Product stock is required',
  },
  isInt: {
    options: { min: 0 },
    errorMessage: 'Product stock must be a non-negative integer',
  },
  toInt: true,
};

export const productStatusSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Product status is required',
  },
  isIn: {
    options: [
      [EProductStatus.AVAILABLE, EProductStatus.OUT_OF_STOCK, EProductStatus.PREORDER, EProductStatus.DISCONTINUED],
    ],
    errorMessage: 'Invalid product status',
  },
};

export const productMetadataSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: 'Product metadata must be a string',
  },
};

export const productShopIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Shop ID is required',
  },
  isInt: {
    errorMessage: 'Shop ID must be a valid integer',
  },
  toInt: true,
};

export const productStockQuantitySchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Quantity is required',
  },
  isInt: {
    options: { min: 1 },
    errorMessage: 'Quantity must be a positive integer',
  },
  toInt: true,
};

export const productStockOperationSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Operation is required',
  },
  isIn: {
    options: [['add', 'subtract']],
    errorMessage: "Operation must be either 'add' or 'subtract'",
  },
};

// Optional schemas for update operations
export const productNameOptionalSchema: ParamSchema = {
  optional: true,
  ...productNameSchema,
};

export const productSkuOptionalSchema: ParamSchema = {
  optional: true,
  ...productSkuSchema,
};

export const productCategoryOptionalSchema: ParamSchema = {
  optional: true,
  ...productCategorySchema,
};

export const productPriceOptionalSchema: ParamSchema = {
  optional: true,
  ...productPriceSchema,
};

export const productStockOptionalSchema: ParamSchema = {
  optional: true,
  ...productStockSchema,
};

export const productStatusOptionalSchema: ParamSchema = {
  optional: true,
  ...productStatusSchema,
};

// Search query schemas
export const searchKeywordSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: 'Search keyword must be a string',
  },
  trim: true,
};

export const searchCategorySchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: 'Category must be a string',
  },
  trim: true,
};

export const searchShopIdSchema: ParamSchema = {
  optional: true,
  isInt: {
    errorMessage: 'Shop ID must be a valid integer',
  },
  toInt: true,
};

export const searchOffsetSchema: ParamSchema = {
  optional: true,
  isInt: {
    options: { min: 0 },
    errorMessage: 'Offset must be a non-negative integer',
  },
  toInt: true,
};

export const searchLimitSchema: ParamSchema = {
  optional: true,
  isInt: {
    options: { min: 1, max: 100 },
    errorMessage: 'Limit must be between 1 and 100',
  },
  toInt: true,
};
