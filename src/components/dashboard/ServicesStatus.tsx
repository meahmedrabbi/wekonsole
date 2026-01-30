'use client';

import {
  Box,
  Typography,
  Chip,
  Stack,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material';

interface ServiceRow {
  name: string;
  status: 'running' | 'stopped' | 'error';
  port?: number;
  cpu: number;
  memory: number;
}

const mockServices: ServiceRow[] = [
  { name: 'nginx', status: 'running', port: 80, cpu: 2.3, memory: 45 },
  { name: 'mysql', status: 'running', port: 3306, cpu: 8.7, memory: 512 },
  { name: 'redis', status: 'running', port: 6379, cpu: 1.2, memory: 128 },
  { name: 'php-fpm', status: 'running', port: 9000, cpu: 3.5, memory: 256 },
  { name: 'postgresql', status: 'stopped', port: 5432, cpu: 0, memory: 0 },
  { name: 'docker', status: 'running', cpu: 12.5, memory: 890 },
];

export default function ServicesStatus() {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return theme.palette.success.main;
      case 'stopped': return theme.palette.text.secondary;
      case 'error': return theme.palette.error.main;
      default: return theme.palette.text.secondary;
    }
  };

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
        height: '100%',
      }}
    >
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2.5 }}>
        Services Status
      </Typography>
      <Stack spacing={0}>
        {/* Header */}
        <Stack
          direction="row"
          sx={{
            py: 1,
            px: 1.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.grey[500], 0.04),
            borderRadius: '4px 4px 0 0',
          }}
        >
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ flex: 2 }}>SERVICE</Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }}>PORT</Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ flex: 1 }}>CPU</Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ flex: 1 }}>STATUS</Typography>
        </Stack>
        {/* Rows */}
        {mockServices.map((service) => (
          <Stack
            key={service.name}
            direction="row"
            alignItems="center"
            sx={{
              py: 1.5,
              px: 1.5,
              borderBottom: `1px solid ${theme.palette.divider}`,
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) },
              '&:last-of-type': { borderBottom: 'none' },
            }}
          >
            <Box sx={{ flex: 2 }}>
              <Typography variant="body2" fontWeight={600}>{service.name}</Typography>
            </Box>
            <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                {service.port || '-'}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(service.cpu, 100)}
                  sx={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {service.cpu.toFixed(1)}%
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Chip
                icon={<FiberManualRecord sx={{ fontSize: 8 }} />}
                label={service.status}
                size="small"
                sx={{
                  height: 24,
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  bgcolor: alpha(getStatusColor(service.status), 0.1),
                  color: getStatusColor(service.status),
                  '& .MuiChip-icon': { color: 'inherit' },
                  textTransform: 'capitalize',
                }}
              />
            </Box>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
