'use client';

import { Box, Typography, Stack } from '@mui/material';
import {
  SystemStats,
  ServicesStatus,
  QuickActions,
  ServerInfo,
} from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and manage your server in real-time
        </Typography>
      </Box>

      {/* Dashboard content */}
      <Stack spacing={4}>
        {/* System stats cards */}
        <SystemStats />

        {/* Server information */}
        <ServerInfo />

        {/* Quick actions */}
        <QuickActions />

        {/* Services table */}
        <ServicesStatus />
      </Stack>
    </Box>
  );
}
