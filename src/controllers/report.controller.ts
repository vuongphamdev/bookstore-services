import { Controller, Get, Route, Tags, Query, Response, SuccessResponse } from 'tsoa';
import { reportService } from '../services';
import { Responses } from '../models/responses.model';
import { HTTP_STATUS } from '@constants/http';
import { ErrorWithStatus } from '../models/errors.model';

@Route('reports')
@Tags('Reports')
export class ReportController extends Controller {
  /**
   * Get the top best-selling products
   */
  @Get('top-selling')
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  public async getTopSellingProducts(@Query() top?: number) {
    const limit = top ?? 10;
    const bestSellingProducts = await reportService.getBestSellingProducts(limit);
    return Responses.success(`Top ${limit} best-selling products retrieved successfully`, bestSellingProducts);
  }
}
