'use client';

import { SnackbarProvider, useSnackbar, VariantType } from 'notistack';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { createContext, useContext, useCallback, ReactNode } from 'react';

// Toast context for easy access
interface ToastContextType {
  showToast: (message: string, variant?: VariantType) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

function ToastContent({ children }: { children: ReactNode }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showToast = useCallback(
    (message: string, variant: VariantType = 'default') => {
      enqueueSnackbar(message, {
        variant,
        autoHideDuration: 4000,
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        action: (key) => (
          <IconButton
            size="small"
            onClick={() => closeSnackbar(key)}
            sx={{ color: 'inherit' }}
          >
            <Close fontSize="small" />
          </IconButton>
        ),
      });
    },
    [enqueueSnackbar, closeSnackbar]
  );

  const showSuccess = useCallback(
    (message: string) => showToast(message, 'success'),
    [showToast]
  );

  const showError = useCallback(
    (message: string) => showToast(message, 'error'),
    [showToast]
  );

  const showWarning = useCallback(
    (message: string) => showToast(message, 'warning'),
    [showToast]
  );

  const showInfo = useCallback(
    (message: string) => showToast(message, 'info'),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ showToast, showSuccess, showError, showWarning, showInfo }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <SnackbarProvider
      maxSnack={5}
      preventDuplicate
      dense
    >
      <ToastContent>{children}</ToastContent>
    </SnackbarProvider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
