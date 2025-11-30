import { Request, Response } from 'express';
import { reportService } from '@services';
import { InternalServerError, Responses, TGetTopSellingProductsRequestBody } from '@models';

export const getTopSellingProducts = async (
  req: Request<object, object, TGetTopSellingProductsRequestBody>,
  res: Response
): Promise<Response> => {
  try {
    const top = req.body?.top ?? 10;

    const bestSellingProducts = await reportService.getBestSellingProducts(top);
    return Responses.success(res, `Top ${top} best-selling products retrieved successfully`, bestSellingProducts);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to fetch top selling products');
  }
};
