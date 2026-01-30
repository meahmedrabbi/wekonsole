'use client';

import { Grid } from '@mui/material';
import { Speed, Memory, Storage, Wifi } from '@mui/icons-material';
import { useServerStore } from '@/store';
import { StatCard } from '@/components/common';

export default function SystemStats() {
  const { cpuUsage, memoryUsage, diskUsage, networkSpeed } = useServerStore();

  const stats = [
    {
      title: 'CPU Usage',
      value: `${cpuUsage}%`,
      icon: <Speed fontSize="small" />,
      color: 'primary' as const,
      percentage: cpuUsage,
      trend: { value: 2.5, direction: 'up' as const },
    },
    {
      title: 'Memory',
      value: `${memoryUsage}%`,
      icon: <Memory fontSize="small" />,
      color: 'secondary' as const,
      percentage: memoryUsage,
      trend: { value: 1.2, direction: 'down' as const },
    },
    {
      title: 'Disk Usage',
      value: `${diskUsage}%`,
      icon: <Storage fontSize="small" />,
      color: 'warning' as const,
      percentage: diskUsage,
      subtitle: '234 GB / 500 GB',
    },
    {
      title: 'Network',
      value: `${networkSpeed} MB/s`,
      icon: <Wifi fontSize="small" />,
      color: 'info' as const,
      trend: { value: 15.3, direction: 'up' as const },
      subtitle: 'Total bandwidth',
    },
  ];

  return (
    <Grid container spacing={2.5}>
      {stats.map((stat) => (
        <Grid key={stat.title} size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
}
