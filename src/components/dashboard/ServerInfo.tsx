'use client';

import {
  Box,
  Typography,
  Grid,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Computer,
  Schedule,
  Cloud,
  Fingerprint,
} from '@mui/icons-material';
import { formatUptime } from '@/lib/utils';

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

function InfoItem({ icon, label, value, color }: InfoItemProps) {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: 1,
          bgcolor: alpha(color, 0.1),
          color: color,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="subtitle1" fontWeight={600}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function ServerInfo() {
  const theme = useTheme();

  const serverData = [
    {
      icon: <Computer fontSize="small" />,
      label: 'Hostname',
      value: 'wekonsole-server',
      color: theme.palette.primary.main,
    },
    {
      icon: <Cloud fontSize="small" />,
      label: 'Operating System',
      value: 'Ubuntu 24.04 LTS',
      color: theme.palette.info.main,
    },
    {
      icon: <Fingerprint fontSize="small" />,
      label: 'Kernel',
      value: '6.5.0-35-generic',
      color: theme.palette.secondary.main,
    },
    {
      icon: <Schedule fontSize="small" />,
      label: 'Uptime',
      value: formatUptime(1234567),
      color: theme.palette.success.main,
    },
  ];

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
        Server Information
      </Typography>
      <Grid container spacing={3}>
        {serverData.map((item) => (
          <Grid key={item.label} size={{ xs: 12, sm: 6 }}>
            <InfoItem {...item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
