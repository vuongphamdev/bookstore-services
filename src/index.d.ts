import { TokenPayload } from '@models';
declare module 'express' {
  interface Request {
    user: TokenPayload;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user: TokenPayload;
  }
}
