import { ENV } from '@config';
import cryto from 'crypto';

export const hashPassword = (password: string) => {
  return cryto.createHash('sha256').update(`${ENV.PASSWORD_SALT}$${password}`).digest('hex');
};
