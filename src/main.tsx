import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import {CssBaseline, ThemeProvider} from '@mui/material';
import {lightTheme} from './theme.ts';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SnackbarProvider} from 'notistack';
import {AuthProvider, useAuth} from './context/AuthContext.tsx';
import axios from "./api/axios.ts";

const queryClient = new QueryClient();

export const Providers: React.FC<{ children: React.ReactNode }> = ({children}) => {

    const {token, setToken} = useAuth()!;

    useEffect(() => {
            const reqId = axios.interceptors.request.use(config => {
                config.headers = config.headers ?? {};

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                } else {
                    delete config.headers.Authorization;
                }

                return config;
            });

            const resId = axios.interceptors.response.use(
                r => r,
                err => {
                    if (err.response?.status === 401) {
                        setToken(null);
                    }

                    return Promise.reject(err);
                }
            );

            return () => {
                axios.interceptors.request.eject(reqId);
                axios.interceptors.response.eject(resId);
            };
        },
        [setToken, token]);

    return (
        <ThemeProvider theme={lightTheme}>
            <CssBaseline/>
            <QueryClientProvider client={queryClient}>
                <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <Providers>
                <App/>
            </Providers>
        </AuthProvider>
    </React.StrictMode>
);