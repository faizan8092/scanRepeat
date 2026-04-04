'use client';

import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from '@/src/lib/store';
import { theme } from '@/src/lib/theme';
import { AuthProvider } from '@/src/lib/auth-context';
import { ToastProvider } from '@/src/lib/toast-context';
import { ToastContainer } from '@/src/components/ui/ToastContainer';
import '@fontsource/tektur';

export function Providers({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ReduxProvider store={store}>
        <NextThemesProvider attribute="class" defaultTheme="light" forcedTheme="light">
          <MUIThemeProvider theme={theme}>
            <CssBaseline />
            <ToastProvider>
              <AuthProvider>
                {children}
                <ToastContainer />
              </AuthProvider>
            </ToastProvider>
          </MUIThemeProvider>
        </NextThemesProvider>
      </ReduxProvider>
    </GoogleOAuthProvider>
  );
}
