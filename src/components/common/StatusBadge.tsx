'use client';

import { Chip, ChipProps } from '@mui/material';
import { getStatusColor } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  size?: ChipProps['size'];
}

export default function StatusBadge({ status, size = 'small' }: StatusBadgeProps) {
  const color = getStatusColor(status);

  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      size={size}
      color={color}
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
        '& .MuiChip-label': {
          px: 1.5,
        },
      }}
    />
  );
}
