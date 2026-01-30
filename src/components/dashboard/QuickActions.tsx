'use client';

import {
  Box,
  Typography,
  Grid,
  Paper,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Refresh,
  DeleteSweep,
  Update,
  Backup,
  Article,
  Security,
} from '@mui/icons-material';
import { useQuickActionsStore, QuickAction } from '@/store';
import { useState } from 'react';

const iconMap: Record<string, React.ReactNode> = {
  refresh: <Refresh />,
  cache: <DeleteSweep />,
  update: <Update />,
  backup: <Backup />,
  logs: <Article />,
  security: <Security />,
};

export default function QuickActions() {
  const theme = useTheme();
  const { actions, executeAction } = useQuickActionsStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (action: QuickAction) => {
    setLoadingId(action.id);
    await executeAction(action.id);
    setLoadingId(null);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {actions.map((action) => (
          <Grid key={action.id} size={{ xs: 6, sm: 4, md: 2 }}>
            <Tooltip title={action.description}>
              <Paper
                variant="outlined"
                onClick={() => handleAction(action)}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderRadius: 2,
                  bgcolor: loadingId === action.id ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  borderColor: action.dangerous ? alpha(theme.palette.error.main, 0.3) : undefined,
                  '&:hover': {
                    bgcolor: alpha(
                      action.dangerous ? theme.palette.error.main : theme.palette.primary.main,
                      0.08
                    ),
                    borderColor: action.dangerous ? theme.palette.error.main : theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    bgcolor: alpha(
                      action.dangerous ? theme.palette.error.main : theme.palette.primary.main,
                      0.1
                    ),
                    color: action.dangerous ? 'error.main' : 'primary.main',
                  }}
                >
                  {iconMap[action.icon] || <Refresh />}
                </Box>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  textAlign="center"
                  sx={{
                    color: action.dangerous ? 'error.main' : 'text.primary',
                  }}
                >
                  {action.name}
                </Typography>
              </Paper>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
