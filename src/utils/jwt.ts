import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    sub: string;        // Username/Email
    roles: unknown;
    exp: number;
    iat: number;
    userId?: string;
}

export function extractUserId(token: string): string | null {
    try {
        const decoded = jwtDecode<JwtPayload>(token);

        return decoded.userId ?? null;
    } catch {
        return null;
    }
}