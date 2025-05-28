/**
 * Represents the standard JWT claims included in a JSON Web Token payload.
 */
export interface JwtPayload {
  /** Subject (typically the user ID) */
  sub: string;
  /** Expiration time (Unix timestamp in seconds) */
  exp: number;
  /** Issued at time (Unix timestamp in seconds) */
  iat: number;
  /** JWT ID (unique identifier for the token) */
  jti: string;
  /** Issuer of the token */
  iss: string;
}

/**
 * Represents custom claims added to the JWT payload.
 */
export interface CustomTokenPayload {
  /** Type of the token, either 'access' or 'refresh' */
  type: 'access' | 'refresh';
}

/**
 * Combines standard JWT claims with custom claims for a decoded token.
 */
export interface DecodedToken extends JwtPayload, CustomTokenPayload {}

/**
 * Interface for JWT service handling token generation and verification.
 */
export interface IJwtService {
  /**
   * Generates a pair of access and refresh tokens for a user.
   * @param userId - The unique identifier of the user.
   * @returns An object containing the generated access and refresh tokens.
   */
  generateTokenPair(userId: string): {
    accessToken: string;
    refreshToken: string;
  };

  /**
   * Verifies the validity of an access token.
   * @param token - The access token to verify.
   * @returns The decoded token payload if valid, or null if invalid.
   */
  verifyAccessToken(token: string): DecodedToken | null;

  /**
   * Verifies the validity of a refresh token.
   * @param token - The refresh token to verify.
   * @returns The decoded token payload if valid, or null if invalid.
   */
  verifyRefreshToken(token: string): DecodedToken | null;

  /**
   * Decodes a JWT without verifying its signature.
   * @param token - The JWT to decode.
   * @returns The decoded token payload if decodable, or null if invalid.
   */
  decodeToken(token: string): DecodedToken | null;
}
