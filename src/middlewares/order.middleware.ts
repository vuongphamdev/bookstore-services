import { checkSchema, ParamSchema } from 'express-validator';
import { validate } from '@utils';
import {
  orderShopIdSchema,
  orderItemsSchema,
  orderNotesSchema,
  orderItemProductIdSchema,
  orderItemQuantitySchema,
} from './validation-schemas';
import { TCreateOrderRequestBody, TUpdateOrderRequestBody, TAddOrderItemRequestBody } from '@models';

export const createOrderBodyValidator = validate(
  checkSchema(
    {
      shop_id: orderShopIdSchema,
      items: orderItemsSchema,
      notes: orderNotesSchema,
    } as Record<keyof TCreateOrderRequestBody, ParamSchema>,
    ['body']
  )
);

export const updateOrderBodyValidator = validate(
  checkSchema(
    {
      notes: orderNotesSchema,
    } as Record<keyof TUpdateOrderRequestBody, ParamSchema>,
    ['body']
  )
);

export const addOrderItemBodyValidator = validate(
  checkSchema(
    {
      product_id: orderItemProductIdSchema,
      quantity: orderItemQuantitySchema,
    } as Record<keyof TAddOrderItemRequestBody, ParamSchema>,
    ['body']
  )
);
