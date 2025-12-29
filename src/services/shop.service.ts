import { db } from '@config';
import { EShopStatus } from '@constants';
import { TCreateShopData, TShop, TUpdateShopData } from '@models/schemas';

class ShopService {
  /**
   * Get shop by ShopID
   */
  async getShop(id: number): Promise<TShop | null> {
    const row = await db<TShop>('shops').select('*').where({ id }).first();
    return row ?? null;
  }

  /**
   * Get shops by UserID
   */
  async getShopsByUserId(user_id: number): Promise<TShop[]> {
    const rows = await db<TShop>('shops').select('*').where({ user_id });
    return rows;
  }

  /**
   * Create a new shop
   */
  async createShop(createData: TCreateShopData): Promise<number> {
    const [id] = await db<TShop>('shops').insert(createData);
    return id;
  }

  /**
   * Update shop
   */
  async updateShop(id: number, updateData: TUpdateShopData): Promise<number> {
    return await db<TShop>('shops')
      .where({ id })
      .update({ ...updateData, updated_at: db.fn.now() });
  }

  /**
   * Delete shop
   */
  async deleteShop(id: number): Promise<number> {
    return await db<TShop>('shops').where({ id }).update({ status: EShopStatus.DELETED, updated_at: db.fn.now() });
  }
}

export const shopService = new ShopService();
