/**
 * Utility for JWT token handling and validation.
 * This module provides functions to extract user information from JWT tokens
 * and check token expiration status.
 */
import {jwtDecode} from 'jwt-decode';

/**
 * Interface representing the payload structure of JWT tokens used in the application.
 * Contains standard JWT claims and application-specific fields.
 */
interface JwtPayload {
    sub: string;
    roles: unknown;
    exp: number;
    iat: number;
    userId?: string;
}

/**
 * Extracts the user ID from a JWT token.
 *
 * @param token - The JWT token to decode and extract user ID from
 * @returns The user ID if found in the token, otherwise null
 */
export function extractUserId(token: string): string | null {
    try {
        const decoded = jwtDecode<JwtPayload>(token);

        return decoded.userId ?? null;
    } catch {
        return null;
    }
}