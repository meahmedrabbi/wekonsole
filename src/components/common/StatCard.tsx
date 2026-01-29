'use client';

import { Box, Typography, LinearProgress, useTheme } from '@mui/material';
import { formatPercentage, getPercentageColor } from '@/lib/utils';

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
  const progressColor = percentage !== undefined ? getPercentageColor(percentage) : color;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 24px rgba(0, 0, 0, 0.4)'
            : '0 8px 24px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: 'text.secondary',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              mt: 0.5,
            }}
          >
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            borderRadius: 2,
            bgcolor: `${theme.palette[color].main}15`,
            color: `${color}.main`,
          }}
        >
          {icon}
        </Box>
      </Box>

      {/* Progress bar (if percentage provided) */}
      {percentage !== undefined && (
        <Box sx={{ mb: 1.5 }}>
          <LinearProgress
            variant="determinate"
            value={percentage}
            color={progressColor}
            sx={{
              height: 6,
              borderRadius: 1,
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.08)',
            }}
          />
        </Box>
      )}

      {/* Footer */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
        {percentage !== undefined && (
          <Typography
            variant="body2"
            sx={{
              color: `${progressColor}.main`,
              fontWeight: 600,
            }}
          >
            {formatPercentage(percentage)}
          </Typography>
        )}
        {subtitle && (
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary' }}
          >
            {subtitle}
          </Typography>
        )}
        {trend && (
          <Typography
            variant="body2"
            sx={{
              color: trend.direction === 'up' ? 'success.main' : 'error.main',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
          </Typography>
        )}
      </Box>
    </Box>
  );
}
