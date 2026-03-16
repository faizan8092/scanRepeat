import { createTheme } from '@mui/material/styles';

// This is a basic MUI theme that will be enhanced by Tailwind's CSS variables
export const theme = createTheme({
  typography: {
    fontFamily: '"Tektur", "Geist", "Inter", sans-serif',
  },
  palette: {
    primary: {
      main: '#3b82f6', // Matches --primary (hsl 221 83% 53%)
    },
    secondary: {
      main: '#f1f5f9', // Matches --secondary
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 'var(--radius-md)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
        },
      },
    },
  },
});
