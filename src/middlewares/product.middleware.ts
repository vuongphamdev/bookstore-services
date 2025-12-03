import { checkSchema, ParamSchema, Schema } from 'express-validator';
import { validate } from '@utils';
import {
  productNameSchema,
  productSkuSchema,
  productCategorySchema,
  productDescriptionSchema,
  productPriceSchema,
  productStockSchema,
  productStatusSchema,
  productMetadataSchema,
  productShopIdSchema,
  productStockQuantitySchema,
  productStockOperationSchema,
  productNameOptionalSchema,
  productSkuOptionalSchema,
  productCategoryOptionalSchema,
  productPriceOptionalSchema,
  productStockOptionalSchema,
  productStatusOptionalSchema,
  searchKeywordSchema,
  searchCategorySchema,
  searchShopIdSchema,
  searchOffsetSchema,
  searchLimitSchema,
} from './validation-schemas';
import {
  TCreateProductRequestBody,
  TUpdateProductRequestBody,
  TUpdateProductStockRequestBody,
  TSearchProductsRequestQueryParams,
} from '@models';

export const searchProductsQueryValidator = validate(
  checkSchema(
    {
      keyword: searchKeywordSchema,
      category: searchCategorySchema,
      shop_id: searchShopIdSchema,
      offset: searchOffsetSchema,
      limit: searchLimitSchema,
    } as Record<keyof TSearchProductsRequestQueryParams, ParamSchema>,
    ['query']
  )
);

export const createProductBodyValidator = validate(
  checkSchema(
    {
      name: productNameSchema,
      sku: productSkuSchema,
      category: productCategorySchema,
      description: productDescriptionSchema,
      price: productPriceSchema,
      stock: productStockSchema,
      status: productStatusSchema,
      metadata: productMetadataSchema,
      shop_id: productShopIdSchema,
    } as Record<keyof TCreateProductRequestBody, ParamSchema>,
    ['body']
  )
);

export const updateProductBodyValidator = validate(
  checkSchema(
    {
      name: productNameOptionalSchema,
      sku: productSkuOptionalSchema,
      category: productCategoryOptionalSchema,
      description: productDescriptionSchema,
      price: productPriceOptionalSchema,
      stock: productStockOptionalSchema,
      status: productStatusOptionalSchema,
      metadata: productMetadataSchema,
    } as Record<keyof TUpdateProductRequestBody, ParamSchema>,
    ['body']
  )
);

export const updateProductStockBodyValidator = validate(
  checkSchema(
    {
      quantity: productStockQuantitySchema,
      operation: productStockOperationSchema,
    } as Record<keyof TUpdateProductStockRequestBody, ParamSchema>,
    ['body']
  )
);
