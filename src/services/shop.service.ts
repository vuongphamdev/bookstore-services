import { db } from '@config';
import { Shop, CreateShopData, UpdateShopData } from '@models/schemas';

class ShopService {
  /**
   * Get all shops
   */
  async getShops(): Promise<Shop[]> {
    const rows = await db<Shop>('shops').select('*');
    return rows.map((row) => Shop.fromRow(row));
  }

  /**
   * Get shops by seller ID (one seller can have multiple shops)
   */
  async getShopsBySeller(seller_id: number): Promise<Shop[]> {
    const rows = await db<Shop>('shops').select('*').where({ user_id: seller_id });
    return rows.map((row) => Shop.fromRow(row));
  }

  /**
   * Get shop by ID
   */
  async getShop(id: number): Promise<Shop | null> {
    const row = await db<Shop>('shops').select('*').where({ id }).first();
    return row ? Shop.fromRow(row) : null;
  }

  /**
   * Create a new shop
   */
  async createShop(data: CreateShopData): Promise<number> {
    const [id] = await db<Shop>('shops').insert({
      name: data.name,
      user_id: data.user_id,
      description: data.description || null,
    });

    return id;
  }

  /**
   * Update shop
   */
  async updateShop(id: number, data: UpdateShopData): Promise<number> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;

    return await db<Shop>('shops').where({ id }).update(updateData);
  }

  /**
   * Delete shop
   */
  async deleteShop(id: number): Promise<number> {
    return await db<Shop>('shops').where({ id }).del();
  }
}

export const shopService = new ShopService();
