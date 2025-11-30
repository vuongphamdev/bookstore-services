import { ENV } from '@config';
import { ERole } from '@constants';
import { signToken, verifyToken } from '@utils';

enum TokenType {
  AccessToken,
  RefreshToken,
  EmailVerifyToken,
  ForgotPasswordToken,
}

interface signTokenProps {
  user_id: number;
  email: string;
  role: ERole;
}

export class AuthService {
  static signAccessToken(signProps: signTokenProps) {
    return signToken({
      payload: { ...signProps, token_type: TokenType.AccessToken },
      privateKey: ENV.JWT_ACCESS_TOKEN_SECRET,
      options: { expiresIn: ENV.JWT_ACCESS_TOKEN_EXPIRE_TIME },
    });
  }

  static signRefreshToken(signProps: signTokenProps) {
    return signToken({
      payload: { ...signProps, token_type: TokenType.RefreshToken },
      privateKey: ENV.JWT_REFRESH_TOKEN_SECRET,
      options: { expiresIn: ENV.JWT_REFRESH_TOKEN_EXPIRE_TIME },
    });
  }

  static signVerifyEmailToken(signProps: signTokenProps) {
    return signToken({
      payload: { ...signProps, token_type: TokenType.EmailVerifyToken },
      privateKey: ENV.JWT_VERIFY_EMAIL_TOKEN_SECRET,
      options: { expiresIn: ENV.JWT_VERIFY_EMAIL_TOKEN_EXPIRE_TIME },
    });
  }

  static signForgotPasswordToken(signProps: signTokenProps) {
    return signToken({
      payload: {
        ...signProps,
        token_type: TokenType.ForgotPasswordToken,
      },
      privateKey: ENV.JWT_FORGOT_PASSWORD_TOKEN_SECRET,
      options: { expiresIn: ENV.JWT_FORGOT_PASSWORD_TOKEN_EXPIRE_TIME },
    });
  }

  static signAccessAndRefreshToken(signProps: signTokenProps) {
    return Promise.all([this.signAccessToken(signProps), this.signRefreshToken(signProps)]);
  }

  static verifyAuthorizationToken(token: string) {
    return verifyToken({ token, secretKey: ENV.JWT_ACCESS_TOKEN_SECRET });
  }

  static verifyRefreshToken(token: string) {
    return verifyToken({ token, secretKey: ENV.JWT_REFRESH_TOKEN_SECRET });
  }
}
