'use client';

import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  RestartAlt,
  DeleteSweep,
  SystemUpdate,
  Backup,
  Article,
  Security,
} from '@mui/icons-material';
import { useToast } from '@/components/providers';

const actions = [
  { label: 'Restart Server', icon: <RestartAlt fontSize="small" />, color: 'warning' as const, description: 'Restart all services' },
  { label: 'Clear Cache', icon: <DeleteSweep fontSize="small" />, color: 'info' as const, description: 'Clear system caches' },
  { label: 'System Update', icon: <SystemUpdate fontSize="small" />, color: 'success' as const, description: 'Check for updates' },
  { label: 'Backup Now', icon: <Backup fontSize="small" />, color: 'primary' as const, description: 'Create backup' },
  { label: 'View Logs', icon: <Article fontSize="small" />, color: 'secondary' as const, description: 'System log viewer' },
  { label: 'Security Scan', icon: <Security fontSize="small" />, color: 'error' as const, description: 'Run security audit' },
];

export default function QuickActions() {
  const theme = useTheme();
  const { showSuccess } = useToast();

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
        height: '100%',
      }}
    >
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2.5 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={1.5}>
        {actions.map((action) => (
          <Grid key={action.label} size={{ xs: 6, sm: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => showSuccess(`${action.label} initiated`)}
              sx={{
                py: 1.5,
                flexDirection: 'column',
                gap: 0.75,
                borderColor: theme.palette.divider,
                color: 'text.primary',
                '&:hover': {
                  borderColor: theme.palette[action.color].main,
                  bgcolor: alpha(theme.palette[action.color].main, 0.04),
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  bgcolor: alpha(theme.palette[action.color].main, 0.1),
                  color: `${action.color}.main`,
                }}
              >
                {action.icon}
              </Box>
              <Typography variant="caption" fontWeight={600} sx={{ textTransform: 'none' }}>
                {action.label}
              </Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
