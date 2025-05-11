import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from './theme.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { attachAuthInterceptor } from './api/axios.ts';

const queryClient = new QueryClient();

// eslint-disable-next-line react-refresh/only-export-components
const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { token, setToken } = useAuth(); // re‑renders interceptor when token changes
    useEffect(() => attachAuthInterceptor(() => token, () => setToken(null)),
        [setToken, token]);

    return (
        <ThemeProvider theme={lightTheme}>
            <CssBaseline />
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
                <App />
            </Providers>
        </AuthProvider>
    </React.StrictMode>
);