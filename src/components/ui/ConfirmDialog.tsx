'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { Warning, Error, Info, CheckCircle } from '@mui/icons-material';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'warning' | 'error' | 'info' | 'success';
  loading?: boolean;
}

const iconMap = {
  warning: <Warning color="warning" sx={{ fontSize: 48 }} />,
  error: <Error color="error" sx={{ fontSize: 48 }} />,
  info: <Info color="info" sx={{ fontSize: 48 }} />,
  success: <CheckCircle color="success" sx={{ fontSize: 48 }} />,
};

const colorMap = {
  warning: 'warning',
  error: 'error',
  info: 'primary',
  success: 'success',
} as const;

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  loading = false,
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>{title}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            py: 2,
          }}
        >
          {iconMap[variant]}
          <Typography sx={{ mt: 2 }}>{message}</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined">
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          color={colorMap[variant]}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
