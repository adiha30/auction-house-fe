import React, {createContext, useContext, useEffect, useState} from 'react';
import {extractUserId, isExpired} from "../utils/jwt.ts";

type AuthCtx = {
    token: string | null;
    userId: string | null;
    setToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [token, setToken] = useState<string | null>((() => localStorage.getItem('token')));
    const [userId, setUserId] = useState<string | null>((() => localStorage.getItem('userId')));

    useEffect(() => {
        if (!token || isExpired(token)) {
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            setUserId(null);
        } else {
            localStorage.setItem('token', token);
            const id = extractUserId(token);
            setUserId(id);
            if (id) localStorage.setItem('userId', id);
        }
    }, [token]);


    return <AuthContext.Provider value={{token, userId, setToken}}>{children}</AuthContext.Provider>

}