/**
 * Authentication Context
 *
 * This module provides a React context for authentication state management throughout the application.
 * It handles JWT token storage, parsing, and validation while providing authenticated user information
 * to components via context.
 */

import React, { createContext, useContext, useEffect, useMemo, useState, } from 'react';
import { jwtDecode } from 'jwt-decode';

/**
 * JWT payload structure from decoded token
 * @interface JwtPayload
 */
interface JwtPayload {
    exp: number;
    userId?: string;
    sub: string;
}

/**
 * Authentication context state and methods
 * @interface AuthCtx
 */
type AuthCtx = {
    token: string | null;
    userId: string | null;
    setToken: (t: string | null) => void;
};

/**
 * Parses a JWT token string into its payload
 * @param t - JWT token string or null
 * @returns Decoded JWT payload or null if invalid
 */
function parseJwt(t: string | null): JwtPayload | null {
    if (!t) return null;
    try {
        return jwtDecode<JwtPayload>(t);
    } catch {
        return null;
    }
}

/**
 * Checks if a JWT token payload is expired
 * @param payload - JWT payload to check
 * @returns True if token is expired or invalid, false otherwise
 */
function isExpired(payload: JwtPayload | null): boolean {
    return !payload || Date.now() >= payload.exp * 1000;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

/**
 * Custom hook to access the authentication context
 * @returns Authentication context object
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Authentication provider component
 * @param props - Component props
 * @param props.children - Child components to be wrapped with the auth provider
 * @returns Authentication context provider with children
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem('token')
    );

    const payload = useMemo(() => parseJwt(token), [token]);
    const userId = payload?.userId ?? null;

    useEffect(() => {
        if (!token || isExpired(payload)) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            if (token) setToken(null);
        } else {
            localStorage.setItem('token', token);
            if (userId) {
                localStorage.setItem('userId', userId);
            } else {
                localStorage.removeItem('userId');
            }
        }
    }, [token, payload, userId]);

    const ctx: AuthCtx = { token, userId, setToken };

    return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
};
