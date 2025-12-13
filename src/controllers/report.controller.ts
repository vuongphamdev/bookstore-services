import { Request, Response } from 'express';
import { reportService } from '@services';
import { Responses, TGetTopSellingProductsRequestQueryParams } from '@models';

export const getTopSellingProducts = async (
  req: Request<any, any, any, TGetTopSellingProductsRequestQueryParams>,
  res: Response
): Promise<Response> => {
  const top = Number(req.query.top ?? 10);
  const bestSellingProducts = await reportService.getBestSellingProducts(top);
  return Responses.success(res, `Top ${top} best-selling products retrieved successfully`, bestSellingProducts);
};
