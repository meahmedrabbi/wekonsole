'use client';

import { Box, Typography, Stack, useTheme, alpha } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  percentage?: number;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  percentage,
  trend,
  color = 'primary',
}: StatCardProps) {
  const theme = useTheme();

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
      <Stack spacing={0.5}>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 1.5,
              bgcolor: alpha(theme.palette[color].main, 0.1),
              color: `${color}.main`,
            }}
          >
            {icon}
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          {trend && (
            <Stack direction="row" alignItems="center" spacing={0.25}>
              {trend.direction === 'up' ? (
                <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  color: trend.direction === 'up' ? 'success.main' : 'error.main',
                  fontWeight: 600,
                }}
              >
                {trend.value}%
              </Typography>
            </Stack>
          )}
          {percentage !== undefined && (
            <Typography variant="caption" color="text.secondary">
              {percentage.toFixed(1)}% used
            </Typography>
          )}
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
