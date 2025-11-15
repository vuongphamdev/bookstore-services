import { Request, Response } from 'express';
import { reportService } from '@services';
import { InternalServerError, Responses } from '@models';

export const getTopSellingProducts = async (
  req: Request<object, object, { top?: number; tenant_id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const top = req.body?.top ?? 10;
    const tenant_id = req.body.tenant_id;

    const bestSellingProducts = await reportService.getBestSellingProducts(tenant_id, top);
    return Responses.success(res, `Top ${top} best-selling products retrieved successfully`, bestSellingProducts);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to fetch top selling products');
  }
};
