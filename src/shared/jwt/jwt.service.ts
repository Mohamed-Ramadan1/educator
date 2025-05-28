// nest imports
import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

// package imports
import { randomUUID } from 'crypto';

// config imports
import { JWTEnvironment, jwtConfig } from '@config/index';

// interfaces imports
import { IJwtService, DecodedToken } from './interfaces/jwt-service.interface';

/**
 * Service for handling JSON Web Token (JWT) operations, including token generation, verification, and decoding.
 */
@Injectable()
export class JwtService implements IJwtService {
  /** Secret key for signing access tokens */
  private readonly accessTokenSecret: string = jwtConfig.accessTokenSecret;
  /** Secret key for signing refresh tokens */
  private readonly refreshTokenSecret: string = jwtConfig.refreshTokenSecret;
  /** Expiration time for access tokens (e.g., '15m' for 15 minutes) */
  private readonly accessTokenExpiresIn: string =
    jwtConfig.accessTokenExpiresIn;
  /** Expiration time for refresh tokens (e.g., '7d' for 7 days) */
  private readonly refreshTokenExpiresIn: string =
    jwtConfig.refreshTokenExpiresIn;
  /** Environment configuration for the JWT issuer */
  private readonly environment: JWTEnvironment = jwtConfig.environment;

  /**
   * Constructs the JwtService with a dependency on NestJS's JwtService.
   * @param nestJWTService - The NestJS JWT service for signing and verifying tokens.
   */
  constructor(private readonly nestJWTService: NestJwtService) {}

  /**
   * Creates a JWT with the specified configuration.
   * @param userId - The unique identifier of the user.
   * @param config - Configuration object containing the secret, expiration time, and token type.
   * @param config.secret - The secret key for signing the token.
   * @param config.expiresIn - The expiration duration for the token (e.g., '15m', '7d').
   * @param config.type - The type of token ('access' or 'refresh').
   * @returns The signed JWT string.
   */
  private createToken(
    userId: string,
    config: {
      secret: string;
      expiresIn: string;
      type: 'access' | 'refresh';
    },
  ): string {
    const payload = { sub: userId, type: config.type };

    return this.nestJWTService.sign(payload, {
      secret: config.secret,
      expiresIn: config.expiresIn,
      jwtid: randomUUID(),
      algorithm: 'HS256',
      issuer: this.environment,
    });
  }

  /**
   * Generates a pair of access and refresh tokens for a user.
   * @param userId - The unique identifier of the user.
   * @returns An object containing the generated access and refresh tokens.
   */
  public generateTokenPair(userId: string): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.createToken(userId, {
        secret: this.accessTokenSecret,
        expiresIn: this.accessTokenExpiresIn,
        type: 'access',
      }),
      refreshToken: this.createToken(userId, {
        secret: this.refreshTokenSecret,
        expiresIn: this.refreshTokenExpiresIn,
        type: 'refresh',
      }),
    };
  }

  /**
   * Verifies a JWT using the provided secret.
   * @param token - The JWT to verify.
   * @param secret - The secret key to verify the token's signature.
   * @returns The decoded token payload if valid, or null if invalid.
   */
  private verifyToken(token: string, secret: string): DecodedToken | null {
    try {
      const validatedToken = this.nestJWTService.verify(token, {
        secret,
        algorithms: ['HS256'],
      });
      return validatedToken as DecodedToken;
    } catch {
      return null;
    }
  }

  /**
   * Verifies the validity of an access token.
   * @param token - The access token to verify.
   * @returns The decoded token payload if valid, or null if invalid.
   */
  verifyAccessToken(token: string): DecodedToken | null {
    return this.verifyToken(token, this.accessTokenSecret);
  }

  /**
   * Verifies the validity of a refresh token.
   * @param token - The refresh token to verify.
   * @returns The decoded token payload if valid, or null if invalid.
   */
  verifyRefreshToken(token: string): DecodedToken | null {
    return this.verifyToken(token, this.refreshTokenSecret);
  }

  /**
   * Decodes a JWT without verifying its signature.
   * @param token - The JWT to decode.
   * @returns The decoded token payload if decodable and valid, or null if invalid.
   */
  decodeToken(token: string): DecodedToken | null {
    try {
      const decoded: DecodedToken | null = this.nestJWTService.decode(token, {
        json: true,
      });

      // Validate the decoded token existence and structure
      if (!decoded || typeof decoded.sub !== 'string') {
        return null;
      }

      // validate the type of token is valid or not
      if (!decoded.type || !['access', 'refresh'].includes(decoded.type)) {
        return null;
      }
      return decoded;
    } catch {
      return null;
    }
  }
}
