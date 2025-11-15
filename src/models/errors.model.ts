import { GENERAL_MESSAGE } from '@constants';
import { HTTP_STATUS } from '@constants/http';

export type ErrorsType = Record<string, { msg: string; [key: string]: any }>;

export class ErrorWithStatus {
  public status: number;
  public message: string;

  constructor({ message, status }: { message: string; status: number }) {
    this.message = message;
    this.status = status;
  }
}

export class EntityError extends ErrorWithStatus {
  public errors: ErrorsType;

  constructor({ message = GENERAL_MESSAGE.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY });
    this.errors = errors;
  }
}

export class NotFoundError extends ErrorWithStatus {
  constructor(message: string = GENERAL_MESSAGE.NOT_FOUND) {
    super({ message, status: HTTP_STATUS.NOT_FOUND });
  }
}

export class UnauthorizedError extends ErrorWithStatus {
  constructor(message: string = GENERAL_MESSAGE.UNAUTHORIZED) {
    super({ message, status: HTTP_STATUS.UNAUTHORIZED });
  }
}

export class ForbiddenError extends ErrorWithStatus {
  constructor(message: string = GENERAL_MESSAGE.FORBIDDEN) {
    super({ message, status: HTTP_STATUS.FORBIDDEN });
  }
}

export class ConflictError extends ErrorWithStatus {
  constructor(message: string = GENERAL_MESSAGE.CONFLICT) {
    super({ message, status: HTTP_STATUS.CONFLICT });
  }
}

export class InternalServerError extends ErrorWithStatus {
  constructor(message: string = GENERAL_MESSAGE.INTERNAL_SERVER_ERROR) {
    super({ message, status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}
