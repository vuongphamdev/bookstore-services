import { JwtPayload } from 'jsonwebtoken';
import { ERole, EOrderStatus, EProductStatus } from '@constants';

export interface TokenPayload extends JwtPayload {
  user_id: number;
  email: string;
  role: ERole;
}

// ======================= Auth Requests =======================
export type TLoginRequestBody = {
  email: string;
  password: string;
};

export type TRegisterRequestBody = {
  email: string;
  name: string;
  password: string;
  dob: Date | null;
  phone_number: string | null;
  address: string | null;
};

// ======================= User Requests =======================
export type TUpdateUserRequestParams = {
  id: string;
};

export type TUpdateUserRequestBody = {
  name?: string;
  dob?: Date | null;
  phone_number?: string | null;
  address?: string | null;
};

// ======================= Order Requests =======================
export type TSearchOrdersRequestQueryParams = {
  status?: string;
};

export type TGetOrderRequestParams = {
  id: string;
};

export type TCreateOrderRequestBody = {
  user_id?: number;
  shop_id?: number | null;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
  notes?: string | null;
};

export type TUpdateOrderRequestParams = {
  id: string;
};

export type TUpdateOrderRequestBody = {
  notes?: string | null;
};

export type TDeleteOrderRequestParams = {
  id: string;
};

export type TGetOrderItemsRequestParams = {
  orderId: string;
};

export type TAddOrderItemRequestParams = {
  orderId: string;
};

export type TAddOrderItemRequestBody = {
  product_id: number;
  quantity: number;
};

export type TRemoveOrderItemRequestParams = {
  itemId: string;
};

// ======================= Product Requests =======================
export type TSearchProductsRequestQueryParams = {
  keyword?: string;
  category?: string;
  shop_id?: number;
  offset?: number;
  limit?: number;
};

export type TGetProductRequestParams = {
  id: string;
};

export type TCreateProductRequestBody = {
  name: string;
  sku: string;
  category: string;
  description?: string | null;
  price: number;
  stock: number;
  status: EProductStatus;
  metadata?: string | null;
  shop_id: number;
};

export type TUpdateProductRequestParams = {
  id: string;
};

export type TUpdateProductRequestBody = {
  name?: string;
  sku?: string;
  category?: string;
  description?: string | null;
  price?: number;
  stock?: number;
  status?: EProductStatus;
  metadata?: string | null;
};

export type TDeleteProductRequestParams = {
  id: string;
};

export type TUpdateProductStockRequestParams = {
  id: string;
};

export type TUpdateProductStockRequestBody = {
  quantity: number;
  operation: 'add' | 'subtract';
};

// ======================= Shop Requests =======================
export type TGetShopRequestParams = {
  id: string;
};

export type TCreateShopRequestBody = {
  name: string;
  description?: string | null;
};

export type TUpdateShopRequestParams = {
  id: string;
};

export type TUpdateShopRequestBody = {
  name?: string;
  description?: string | null;
};

export type TDeleteShopRequestParams = {
  id: string;
};

// ======================= Role Requests =======================
export type TGetRoleRequestParams = {
  id: string;
};

export type TCreateRoleRequestBody = {
  name: string;
  code: ERole;
  description: string | null;
};

export type TUpdateRoleRequestParams = {
  id: string;
};

export type TUpdateRoleRequestBody = {
  name?: string;
  description?: string | null;
};

// ======================= Report Requests =======================
export type TGetTopSellingProductsRequestQueryParams = {
  top?: number;
};
