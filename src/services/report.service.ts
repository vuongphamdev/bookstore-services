import { db } from '@config';
import { EOrderStatus } from '@constants';

class ReportService {
  async getBestSellingProducts(limit: number) {
    const topSales = await db
      .with('top_sales', (qb) => {
        qb.select('product_id')
          .sum({ total_sales: 'quantity' })
          .from('order_items as oi')
          .join('orders as o', 'oi.order_id', 'o.id')
          .where('o.status', EOrderStatus.COMPLETED)
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
