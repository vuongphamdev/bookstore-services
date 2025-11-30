import { EShopStatus } from '@constants';
import { BaseModel, TBaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export type TShop = TBaseModel & {
  name: string;
  user_id: number;
  status: EShopStatus;
  description: string | null;
};

export type TCreateShopData = Omit<TShop, TCreateIgnoreColumns>;
export type TUpdateShopData = Partial<Omit<TShop, TUpdateIgnoreColumns | 'user_id' | 'status'>>;

export class Shop extends BaseModel<TShop> {}
