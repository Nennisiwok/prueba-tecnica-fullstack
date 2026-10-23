import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },
    secondary: { main: '#ef6c00' },
    background: { default: '#f5f7fa' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

export default theme;
