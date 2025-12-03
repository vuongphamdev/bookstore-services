import { ParamSchema } from 'express-validator';
import { EOrderStatus } from '@constants';

export const orderShopIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Shop ID is required',
  },
  isInt: {
    errorMessage: 'Shop ID must be a valid integer',
  },
  toInt: true,
};

export const orderItemsSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Order items are required',
  },
  isArray: {
    options: { min: 1 },
    errorMessage: 'Order items must be a non-empty array',
  },
  custom: {
    options: (items) => {
      if (!Array.isArray(items)) {
        throw new Error('Order items must be an array');
      }

      for (const item of items) {
        if (!item.product_id || typeof item.product_id !== 'number') {
          throw new Error('Each item must have a valid product_id');
        }
        if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1) {
          throw new Error('Each item must have a valid quantity (positive number)');
        }
      }

      return true;
    },
  },
};

export const orderStatusSchema: ParamSchema = {
  optional: true,
  isIn: {
    options: [
      [
        EOrderStatus.PENDING,
        EOrderStatus.CONFIRMED,
        EOrderStatus.PREPARING,
        EOrderStatus.READY_TO_SHIP,
        EOrderStatus.PICKED_UP,
        EOrderStatus.IN_TRANSIT,
        EOrderStatus.OUT_FOR_DELIVERY,
        EOrderStatus.DELIVERED,
        EOrderStatus.COMPLETED,
        EOrderStatus.CANCELLED,
        EOrderStatus.REFUNDED,
      ],
    ],
    errorMessage: 'Invalid order status',
  },
};

export const orderNotesSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: 'Order notes must be a string',
  },
  trim: true,
};

export const orderItemProductIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Product ID is required',
  },
  isInt: {
    errorMessage: 'Product ID must be a valid integer',
  },
  toInt: true,
};

export const orderItemQuantitySchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Quantity is required',
  },
  isInt: {
    options: { min: 1 },
    errorMessage: 'Quantity must be a positive integer',
  },
  toInt: true,
};
