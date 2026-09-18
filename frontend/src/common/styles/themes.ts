import { createTheme } from '@mui/material';

export const colors = {
    primary: '#1b4f72',
    secondary: '#e67e22',
    danger: '#c0392b',
};

export const proconomTheme = createTheme({
    palette: {
        primary: { main: colors.primary },
        secondary: { main: colors.secondary },
        error: { main: colors.danger },
    },
    typography: {
        fontFamily: "Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    components: {
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: { root: { textTransform: 'none' } },
        },
    },
});
