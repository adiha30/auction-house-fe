import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#1976d2' },
        secondary: { main: '#42a5f5' },
    },
    shape: { borderRadius: 8 },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#90caf9' },
        secondary: { main: '#42a5f5' },
    },
    shape: { borderRadius: 8 },
});