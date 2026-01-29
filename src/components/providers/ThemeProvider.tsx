'use client';

import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { useSyncExternalStore } from 'react';
import { useThemeStore } from '@/store';
import { lightTheme, darkTheme } from '@/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Helper to check if we're on the client
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { mode } = useThemeStore();
  
  // Use useSyncExternalStore to properly handle hydration
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Use server-safe theme during SSR, then switch to user preference
  const theme = isClient ? (mode === 'light' ? lightTheme : darkTheme) : darkTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
