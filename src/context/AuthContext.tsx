import React, {createContext, useContext, useEffect, useState} from 'react';

type AuthCtx = {
    token: string | null;
    setToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [token, setToken] = useState<string | null>((() => localStorage.getItem('token')));

    useEffect(() => {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
    }, [token]);

    return <AuthContext.Provider value={{token, setToken}}>{children}</AuthContext.Provider>

}