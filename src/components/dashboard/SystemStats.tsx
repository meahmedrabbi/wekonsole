'use client';

import { Box, Grid, Typography } from '@mui/material';
import {
  Memory,
  Storage,
  NetworkCheck,
  Thermostat,
} from '@mui/icons-material';
import { StatCard } from '@/components/common';
import { useServerStore } from '@/store';
import { formatPercentage } from '@/lib/utils';

export default function SystemStats() {
  const { stats } = useServerStore();

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'CPU Usage',
      value: formatPercentage(stats.cpu.usage),
      subtitle: `${stats.cpu.cores} cores`,
      icon: <Thermostat />,
      percentage: stats.cpu.usage,
      color: 'primary' as const,
    },
    {
      title: 'Memory',
      value: `${stats.memory.used.toFixed(1)} GB`,
      subtitle: `of ${stats.memory.total} GB`,
      icon: <Memory />,
      percentage: stats.memory.percentage,
      color: 'secondary' as const,
    },
    {
      title: 'Disk Usage',
      value: `${stats.disk.used} GB`,
      subtitle: `of ${stats.disk.total} GB`,
      icon: <Storage />,
      percentage: stats.disk.percentage,
      color: 'info' as const,
    },
    {
      title: 'Network',
      value: `↓ ${stats.network.download.toFixed(1)} MB/s`,
      subtitle: `↑ ${stats.network.upload.toFixed(1)} MB/s`,
      icon: <NetworkCheck />,
      color: 'success' as const,
    },
  ];

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        System Overview
      </Typography>
      <Grid container spacing={2}>
        {statCards.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
