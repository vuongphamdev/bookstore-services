import { JwtPayload } from 'jsonwebtoken';

export interface TokenPayload extends JwtPayload {
  user_id: number;
  email: string;
}
