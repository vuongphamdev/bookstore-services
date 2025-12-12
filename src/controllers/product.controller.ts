import { Request, Response } from 'express';
import { productService } from '@services';
import {
  Responses,
  NotFoundError,
  EntityError,
  TGetProductRequestParams,
  TCreateProductRequestBody,
  TUpdateProductRequestParams,
  TUpdateProductRequestBody,
  TDeleteProductRequestParams,
  TUpdateProductStockRequestParams,
  TUpdateProductStockRequestBody,
  TSearchProductsRequestQueryParams,
} from '@models';
import { TCreateProductData, TUpdateProductData } from '@models/schemas';

export const searchProducts = async (
  req: Request<any, any, any, TSearchProductsRequestQueryParams>,
  res: Response
): Promise<Response> => {
  const { keyword, category, shop_id, offset, limit } = req.query;
  const result = await productService.searchProducts({
    keyword,
    category,
    shop_id,
    offset,
    limit,
  });

  return Responses.success(res, 'Products retrieved successfully', result);
};

export const getProduct = async (req: Request<TGetProductRequestParams>, res: Response): Promise<Response> => {
  const { id } = req.params;

  const product = await productService.getProductById(Number(id));

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  return Responses.success(res, 'Product retrieved successfully', product);
};

export const createProduct = async (
  req: Request<any, any, TCreateProductRequestBody>,
  res: Response
): Promise<Response> => {
  const { name, sku, category, description, price, stock, status, metadata, shop_id } = req.body;

  const newProduct: TCreateProductData = {
    name,
    sku,
    category,
    shop_id,
    description,
    price,
    stock,
    status,
    metadata,
  };

  const productId = await productService.createProduct(newProduct);
  const createdProduct = await productService.getProductById(productId);

  return Responses.created(res, 'Product created successfully', createdProduct);
};

export const updateProduct = async (
  req: Request<TUpdateProductRequestParams, any, TUpdateProductRequestBody>,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { name, sku, category, description, price, stock, status, metadata } = req.body;

  const updateData: TUpdateProductData = {};
  if (name) updateData.name = name;
  if (sku) updateData.sku = sku;
  if (category) updateData.category = category;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = price;
  if (stock !== undefined) updateData.stock = stock;
  if (status !== undefined) updateData.status = status;
  if (metadata !== undefined) updateData.metadata = metadata;

  const updatedRows = await productService.updateProduct(Number(id), updateData);

  if (updatedRows === 0) {
    throw new NotFoundError('Product not found');
  }

  const updatedProduct = await productService.getProductById(Number(id));

  return Responses.success(res, 'Product updated successfully', updatedProduct);
};

export const deleteProduct = async (req: Request<TDeleteProductRequestParams>, res: Response): Promise<Response> => {
  const { id } = req.params;

  const deletedRows = await productService.deleteProduct(Number(id));

  if (deletedRows === 0) {
    throw new NotFoundError('Product not found');
  }

  return Responses.success(res, 'Product deleted successfully');
};

export const updateProductStock = async (
  req: Request<TUpdateProductStockRequestParams, any, TUpdateProductStockRequestBody>,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { quantity, operation } = req.body;

  if (quantity === undefined || !operation) {
    throw new EntityError({
      message: 'Quantity and operation are required',
      errors: { quantity: { msg: 'Quantity and operation are required' } },
    });
  }

  let updatedRows;
  if (operation === 'add') {
    updatedRows = await productService.incrementProductStock(Number(id), Number(quantity));
  } else if (operation === 'subtract') {
    updatedRows = await productService.decrementProductStock(Number(id), Number(quantity));
  } else {
    throw new EntityError({
      message: "Operation must be 'add' or 'subtract'",
      errors: { operation: { msg: "Operation must be 'add' or 'subtract'" } },
    });
  }

  if (updatedRows === 0) {
    throw new NotFoundError('Product not found');
  }

  const updatedProduct = await productService.getProductById(Number(id));

  return Responses.success(res, 'Product stock updated successfully', updatedProduct);
};
