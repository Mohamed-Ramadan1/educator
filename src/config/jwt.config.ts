import * as dotenv from 'dotenv';

dotenv.config();

export enum JWTEnvironment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

interface IJwtConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  logOutExpiredIn: string;
  cookieExpiredIn: string;
  environment: JWTEnvironment;
}
export const jwtConfig: IJwtConfig = {
  accessTokenSecret:
    process.env.JWT_ACCESS_TOKEN_SECRET || 'defaultAccessTokenSecret',
  refreshTokenSecret:
    process.env.JWT_REFRESH_TOKEN_SECRET || 'defaultRefreshTokenSecret',
  accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '15m',
  refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
  logOutExpiredIn: process.env.JWT_LOGOUT_EXPIRED_IN || '1d',
  cookieExpiredIn: process.env.JWT_COOKIE_EXPIRED_IN || '7d',
  environment:
    (process.env.NODE_ENV as JWTEnvironment) || JWTEnvironment.Development,
};
