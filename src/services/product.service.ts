import { db } from '@config';
import { Product, TCreateProductData, TProduct, TUpdateProductData } from '@models/schemas';

export interface ISearchProductsParams {
  shop_id?: number;
  keyword?: string;
  category?: string;
  offset?: number;
  limit?: number;
}

class ProductService {
  async searchProducts({ shop_id, keyword, category, offset, limit = 100 }: ISearchProductsParams) {
    let baseQuery = db<TProduct>('products');

    if (shop_id) {
      baseQuery = baseQuery.where({ shop_id });
    }
    if (keyword) {
      baseQuery = baseQuery.where('name', 'like', `%${keyword}%`);
    }
    if (category) {
      baseQuery = baseQuery.whereIn('category', category.split(','));
    }

    // Clone for items and total
    const itemsQuery = baseQuery.clone();
    if (offset) {
      itemsQuery.offset(offset);
    }
    const items = (await itemsQuery.select('*').limit(limit)).map((row) => new Product(row).toObject());

    // For total, do not apply offset/limit
    const total = await baseQuery
      .clone()
      .count<{ count: number }[]>('* as count')
      .then((res) => res[0].count);

    return {
      items,
      total,
    };
  }

  async getProductById(id: number): Promise<TProduct | null> {
    const row = await db<TProduct>('products').where({ id }).first();
    return row ?? null;
  }

  async createProduct(createData: TCreateProductData): Promise<number> {
    const [id] = await db('products').insert(createData);
    return id;
  }

  async updateProduct(id: number, updateData: TUpdateProductData): Promise<number> {
    return await db<TProduct>('products')
      .where({ id })
      .update({ ...updateData, updated_at: db.fn.now() });
  }

  async deleteProduct(id: number): Promise<number> {
    return await db<TProduct>('products').where({ id }).del();
  }

  async incrementProductStock(id: number, quantity: number): Promise<number> {
    return await db<TProduct>('products').where({ id }).increment('stock', quantity);
  }

  async decrementProductStock(id: number, quantity: number): Promise<number> {
    return await db<TProduct>('products').where({ id }).decrement('stock', quantity);
  }
}

export const productService = new ProductService();
