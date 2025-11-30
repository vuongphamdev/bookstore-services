// src/utils/Responses.ts
import { Response } from 'express';
import { EntityError, ErrorWithStatus } from './errors.model';

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: Record<string, string>;
}

export class Responses {
  /**
   * Send a successful response
   */
  static success<T>(res: Response, message: string, data?: T, statusCode: number = 200): Response<ApiResponse<T>> {
    const response: ApiResponse<T> = {
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send a created response
   */
  static created<T>(res: Response, message: string, data?: T): Response {
    return Responses.success(res, message, data, 201);
  }

  /**
   * Send an entity error response
   */
  static entityError(res: Response, entityError: EntityError) {
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
  static error(res: Response, errorWithStatus: ErrorWithStatus) {
    const response: ApiResponse = {
      message: errorWithStatus.message,
    };
    return res.status(errorWithStatus.status).json(response);
  }
}
