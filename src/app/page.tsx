'use client';

import { Box, Typography, Grid } from '@mui/material';
import { SystemStats, ServerInfo, ServicesStatus, QuickActions } from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor your server performance and manage resources
        </Typography>
      </Box>

      {/* Stats Row */}
      <Box sx={{ mb: 3 }}>
        <SystemStats />
      </Box>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Server Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ServerInfo />
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <QuickActions />
        </Grid>

        {/* Services Status */}
        <Grid size={{ xs: 12 }}>
          <ServicesStatus />
        </Grid>
      </Grid>
    </Box>
  );
}
