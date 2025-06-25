import React, {createContext, useContext, useEffect, useMemo, useState,} from 'react';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
    exp: number;
    userId?: string;
    sub: string;
}

type AuthCtx = {
    token: string | null;
    userId: string | null;
    setToken: (t: string | null) => void;
};

function parseJwt(t: string | null): JwtPayload | null {
    if (!t) return null;
    try {
        return jwtDecode<JwtPayload>(t);
    } catch {
        return null;
    }
}

function isExpired(payload: JwtPayload | null): boolean {
    return !payload || Date.now() >= payload.exp * 1000;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);
export const useAuth = () => useContext(AuthContext);

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

    const ctx: AuthCtx = {token, userId, setToken};

    return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
};
