import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Route,
  Tags,
  Body,
  Path,
  Query,
  SuccessResponse,
  Security,
  Middlewares,
  Response,
} from 'tsoa';
import {
  searchProductsQueryValidator,
  createProductBodyValidator,
  updateProductBodyValidator,
  updateProductStockBodyValidator,
} from '../middlewares';
import { productService } from '@services';
import { Responses } from '../models/responses.model';
import {
  TCreateProductRequestBody,
  TUpdateProductRequestBody,
  TUpdateProductStockRequestBody,
} from '../models/requests.model';
import { TCreateProductData, TUpdateProductData } from '../models/schemas';
import { NotFoundError, EntityError, ErrorWithStatus } from '../models/errors.model';
import { HTTP_STATUS } from '@constants/http';

@Route('products')
@Tags('Products')
export class ProductController extends Controller {
  /**
   * Search for products with various filters
   */
  @Get('/')
  @Middlewares(searchProductsQueryValidator)
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed')
  public async searchProducts(
    @Query() keyword?: string,
    @Query() category?: string,
    @Query() shop_id?: number,
    @Query() offset?: number,
    @Query() limit?: number
  ) {
    const result = await productService.searchProducts({
      keyword,
      category,
      shop_id,
      offset,
      limit,
    });

    return Responses.success('Products retrieved successfully', result);
  }

  /**
   * Get a single product by ID
   */
  @Get('{id}')
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'Product not found')
  public async getProduct(@Path() id: number) {
    const product = await productService.getProductById(id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return Responses.success('Product retrieved successfully', product);
  }

  /**
   * Create a new product
   */
  @Post('/')
  @Security('jwt')
  @Middlewares(createProductBodyValidator)
  @SuccessResponse(HTTP_STATUS.CREATED, 'Created')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed')
  public async createProduct(@Body() requestBody: TCreateProductRequestBody) {
    const { name, sku, category, description, price, stock, status, metadata, shop_id } = requestBody;

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

    this.setStatus(201);
    return Responses.success('Product created successfully', createdProduct);
  }

  /**
   * Update an existing product
   */
  @Put('{id}')
  @Security('jwt')
  @Middlewares(updateProductBodyValidator)
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'Product not found')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed')
  public async updateProduct(@Path() id: number, @Body() requestBody: TUpdateProductRequestBody) {
    const { name, sku, category, description, price, stock, status, metadata } = requestBody;

    const updateData: TUpdateProductData = {};
    if (name) updateData.name = name;
    if (sku) updateData.sku = sku;
    if (category) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (status !== undefined) updateData.status = status;
    if (metadata !== undefined) updateData.metadata = metadata;

    const updatedRows = await productService.updateProduct(id, updateData);

    if (updatedRows === 0) {
      throw new NotFoundError('Product not found');
    }

    const updatedProduct = await productService.getProductById(id);

    return Responses.success('Product updated successfully', updatedProduct);
  }

  /**
   * Delete a product
   */
  @Delete('{id}')
  @Security('jwt')
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'Product not found')
  public async deleteProduct(@Path() id: number) {
    const deletedRows = await productService.deleteProduct(id);

    if (deletedRows === 0) {
      throw new NotFoundError('Product not found');
    }

    return Responses.success('Product deleted successfully');
  }

  /**
   * Update product stock
   */
  @Patch('{id}/stock')
  @Security('jwt')
  @Middlewares(updateProductStockBodyValidator)
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'Product not found')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed')
  public async updateProductStock(@Path() id: number, @Body() requestBody: TUpdateProductStockRequestBody) {
    const { quantity, operation } = requestBody;

    let updatedRows;
    if (operation === 'add') {
      updatedRows = await productService.incrementProductStock(id, Number(quantity));
    } else if (operation === 'subtract') {
      updatedRows = await productService.decrementProductStock(id, Number(quantity));
    } else {
      throw new EntityError({
        message: "Operation must be 'add' or 'subtract'",
        errors: { operation: { msg: "Operation must be 'add' or 'subtract'" } },
      });
    }

    if (updatedRows === 0) {
      throw new NotFoundError('Product not found');
    }

    const updatedProduct = await productService.getProductById(id);

    return Responses.success('Product stock updated successfully', updatedProduct);
  }
}
