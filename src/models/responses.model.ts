// src/utils/Responses.ts
import { Response } from 'express';
import { EntityError, ErrorWithStatus } from './errors.model';

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: Record<string, string>;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export class Responses {
  /**
   * Send a successful response
   */
  static success<T>(res: Response, message: string, data?: T, statusCode: number = 200): Response {
    const response: ApiResponse<T> = {
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send a successful response with pagination
   */
  static successWithPagination<T>(
    res: Response,
    message: string,
    data: T,
    currentPage: number,
    totalItems: number,
    itemsPerPage: number,
    statusCode: number = 200
  ): Response {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const response: ApiResponse<T> = {
      message,
      data,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        hasNext: currentPage < totalPages,
        hasPrevious: currentPage > 1,
      },
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send an entity error response
   */
  static entityError(res: Response, entityError: EntityError): Response {
    const response: ApiResponse = {
      message: entityError.message,
      error: Object.entries(entityError.errors).reduce(
        (acc, [key, value]) => {
          acc[key] = value.msg;
          return acc;
        },
        {} as Record<string, string>
      ),
    };
    return res.status(entityError.status).json(response);
  }

  /**
   * Send an error response
   */
  static error(res: Response, errorWithStatus: ErrorWithStatus): Response {
    const response: ApiResponse = {
      message: errorWithStatus.message,
    };
    return res.status(errorWithStatus.status).json(response);
  }

  /**
   * Send a created response
   */
  static created<T>(res: Response, message: string, data?: T): Response {
    return Responses.success(res, message, data, 201);
  }
}
