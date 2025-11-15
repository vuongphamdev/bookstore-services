import { TokenPayload } from '@models';
import jwt from 'jsonwebtoken';

export const signToken = ({
  payload,
  privateKey,
  options = { algorithm: 'HS256' },
}: {
  payload: string | object | Buffer;
  privateKey: string;
  options?: jwt.SignOptions;
}) => {
  return new Promise<string>((res, rej) =>
    jwt.sign(payload, privateKey, options, (err, encoded) => {
      if (err) throw rej(err);
      res(encoded as string);
    })
  );
};

export const verifyToken = ({
  token,
  secretKey,
  options = { algorithms: ['HS256'] },
}: {
  token: string;
  secretKey: string;
  options?: jwt.VerifyOptions;
}) => {
  return new Promise<TokenPayload>((res, rej) =>
    jwt.verify(token, secretKey, options, (err, decoded) => {
      if (err) throw rej(err);
      res(decoded as TokenPayload);
    })
  );
};
