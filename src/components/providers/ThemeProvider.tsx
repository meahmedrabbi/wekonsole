'use client';

import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { useThemeStore } from '@/store';
import { lightTheme, darkTheme } from '@/theme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeStore();
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
