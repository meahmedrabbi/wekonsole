'use client';

import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  useTheme,
} from '@mui/material';
import {
  AccessTime,
  Computer,
  Memory,
} from '@mui/icons-material';
import { useServerStore } from '@/store';
import { formatUptime } from '@/lib/utils';

export default function ServerInfo() {
  const theme = useTheme();
  const { stats } = useServerStore();

  if (!stats) {
    return null;
  }

  const infoItems = [
    {
      label: 'Hostname',
      value: stats.hostname,
      icon: <Computer />,
    },
    {
      label: 'Operating System',
      value: stats.os,
      icon: <Memory />,
    },
    {
      label: 'Kernel',
      value: stats.kernel,
      icon: <Memory />,
    },
    {
      label: 'Uptime',
      value: formatUptime(stats.uptime),
      icon: <AccessTime />,
    },
  ];

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Server Information
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
        <Grid container spacing={2}>
          {infoItems.map((item, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1.5,
                    bgcolor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.04)',
                    color: 'text.secondary',
                  }}
                >
                  {item.icon}
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="Online"
              size="small"
              color="success"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={`CPU: ${stats.cpu.model}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${stats.cpu.cores} Cores`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${stats.memory.total} GB RAM`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
