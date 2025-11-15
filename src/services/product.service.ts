import { db } from '@config';
import { Product, UpdateProductData } from '@models/schemas';

class ProductService {
  async searchProducts(shop_id: number, category?: string): Promise<Product[]> {
    let query = db<Product>('products').select('*').where({ shop_id });

    if (category) {
      query = query.andWhere({ category });
    }

    const rows = await query.limit(100);
    return rows.map((row) => Product.fromRow(row));
  }

  async getProductById(id: number): Promise<Product | null> {
    const row = await db<Product>('products').where({ id }).first();
    return row ? Product.fromRow(row) : null;
  }

  async getProductBySku(shop_id: number, sku: string): Promise<Product | null> {
    const row = await db<Product>('products').where({ sku, shop_id }).first();
    return row ? Product.fromRow(row) : null;
  }

  async createProduct(productData: Product): Promise<number[]> {
    const dataToInsert: any = {
      ...productData,
      metadata: productData.metadata ? JSON.stringify(productData.metadata) : null,
    };
    return await db('products').insert(dataToInsert);
  }

  async updateProduct(id: number, productData: UpdateProductData): Promise<number> {
    const dataToUpdate: any = { ...productData };

    if (productData.metadata !== undefined) {
      dataToUpdate.metadata = productData.metadata ? JSON.stringify(productData.metadata) : null;
    }

    return await db<Product>('products').where({ id }).update(dataToUpdate);
  }

  async deleteProduct(id: number): Promise<number> {
    return await db<Product>('products').where({ id }).del();
  }

  async updateProductStock(id: number, quantity: number): Promise<number> {
    return await db<Product>('products').where({ id }).increment('stock', quantity);
  }

  async decrementProductStock(id: number, quantity: number): Promise<number> {
    return await db<Product>('products').where({ id }).decrement('stock', quantity);
  }

  async searchProductsByName(shop_id: number, name: string): Promise<Product[]> {
    const rows = await db<Product>('products').where({ shop_id }).andWhere('name', 'like', `%${name}%`);
    return rows.map((row) => Product.fromRow(row));
  }

  async searchProductsByCategory(shop_id: number, category: string): Promise<Product[]> {
    const rows = await db<Product>('products').where({ shop_id, category });
    return rows.map((row) => Product.fromRow(row));
  }
}

export const productService = new ProductService();
