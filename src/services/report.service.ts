import { db } from '@config';
import { OrderItem } from '@models/schemas';

class ReportService {
  async getBestSellingProducts(tenant_id: string, limit: number) {
    const topSales = await db
      .with('top_sales', (qb) => {
        qb.select('product_id')
          .sum({ total_sales: 'quantity' })
          .from<OrderItem>('order_items as oi')
          .join('orders as o', 'oi.order_id', 'o.id')
          .where('o.tenant_id', tenant_id)
          .groupBy('product_id')
          .orderBy('total_sales', 'desc')
          .limit(limit);
      })
      .select('products.*', 'ts.total_sales')
      .from('top_sales as ts')
      .join('products', 'ts.product_id', 'products.id');
    return topSales;
  }
}

export const reportService = new ReportService();
