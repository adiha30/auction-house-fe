import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
    sub: string;
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

export const isExpired = (token: string) => {
    try {
        const {exp} = jwtDecode<{ exp: number }>(token);

        return Date.now() >= exp * 1000;
    } catch {
        return true;
    }
};