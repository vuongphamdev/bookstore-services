import { Request, Response } from 'express';
import { productService } from '@services';
import { Responses, InternalServerError, NotFoundError, EntityError } from '@models';
import { Product, UpdateProductData } from '@models/schemas';

export const searchProducts = async (req: Request, res: Response): Promise<Response> => {
  try {
    let products;

    // if (name) {
    //   products = await productService.searchProductsByName(name as string, tenant_id);
    // } else if (category) {
    //   products = await productService.searchProductsByCategory(category as string, tenant_id);
    // } else if (inStock === 'true') {
    //   products = await productService.getProductsInStock(tenant_id);
    // } else {
    //   products = await productService.searchProducts(tenant_id);
    // }

    return Responses.success(res, 'Products retrieved successfully', products);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to fetch products');
  }
};

export const getProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const product = await productService.getProductById(Number(id));

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return Responses.success(res, 'Product retrieved successfully', product);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to fetch product');
  }
};

export const createProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, sku, category, description, price, stock, status, metadata } = req.body;

    const newProduct = new Product({
      name,
      sku,
      category,
      description: description || null,
      price: Number(price),
      stock: stock !== undefined ? Number(stock) : 0,
      status: status,
      metadata: metadata || null,
    });

    const [productId] = await productService.createProduct(newProduct);
    const createdProduct = await productService.getProductById(productId);

    return Responses.created(res, 'Product created successfully', createdProduct);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to create product');
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params as { id: string };
    const { name, sku, category, description, price, stock, status, metadata } = req.body;

    const updateData: UpdateProductData = {};
    if (name) updateData.name = name;
    if (sku) updateData.sku = sku;
    if (category) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (stock !== undefined) updateData.stock = Number(stock);
    if (status !== undefined) updateData.status = status;
    if (metadata !== undefined) updateData.metadata = metadata;

    const updatedRows = await productService.updateProduct(Number(id), updateData);

    if (updatedRows === 0) {
      throw new NotFoundError('Product not found');
    }

    const updatedProduct = await productService.getProductById(Number(id));

    return Responses.success(res, 'Product updated successfully', updatedProduct);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to update product');
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params as { id: string };

    const deletedRows = await productService.deleteProduct(Number(id));

    if (deletedRows === 0) {
      throw new NotFoundError('Product not found');
    }

    return Responses.success(res, 'Product deleted successfully');
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to delete product');
  }
};

export const updateProductStock = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { quantity, operation } = req.body as {
      quantity: number;
      operation: string;
    }; // operation: 'add' or 'subtract'

    if (quantity === undefined || !operation) {
      throw new EntityError({
        message: 'Quantity and operation are required',
        errors: { quantity: { msg: 'Quantity and operation are required' } },
      });
    }

    let updatedRows;
    if (operation === 'add') {
      updatedRows = await productService.updateProductStock(Number(id), Number(quantity));
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
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to update product stock');
  }
};
