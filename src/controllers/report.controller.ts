import { Request, Response } from 'express';
import { reportService } from '@services';
import { InternalServerError, Responses, TGetTopSellingProductsRequestParams } from '@models';

export const getTopSellingProducts = async (
  req: Request<TGetTopSellingProductsRequestParams>,
  res: Response
): Promise<Response> => {
  const top = Number(req.params.top) ?? 10;
  const bestSellingProducts = await reportService.getBestSellingProducts(top);
  return Responses.success(res, `Top ${top} best-selling products retrieved successfully`, bestSellingProducts);
};
