export type TBaseModel = {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
};

export type TCreateIgnoreColumns = 'id' | 'created_at' | 'updated_at';
export type TUpdateIgnoreColumns = 'id' | 'created_at' | 'updated_at';

/**
 * Base model class with common properties
 */
export abstract class BaseModel<T> {
  constructor(data: Partial<T>) {
    Object.assign(this, data);
  }

  /**
   * Convert instance to object format
   */
  toObject(): T {
    return { ...(this as object) } as T;
  }
}
