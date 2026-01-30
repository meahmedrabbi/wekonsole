'use client';

import {
  Box,
  Skeleton,
  TableRow,
  TableCell,
  Paper,
  useTheme,
} from '@mui/material';

interface LoadingSkeletonProps {
  variant?: 'table' | 'card' | 'text' | 'form';
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton animation="wave" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function CardSkeleton() {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="60%" height={24} />
          <Skeleton width="40%" height={16} />
        </Box>
      </Box>
      <Skeleton width="100%" height={80} />
    </Paper>
  );
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {Array.from({ length: fields }).map((_, index) => (
        <Box key={index}>
          <Skeleton width="30%" height={16} sx={{ mb: 1 }} />
          <Skeleton variant="rounded" height={56} />
        </Box>
      ))}
      <Skeleton variant="rounded" width={120} height={40} />
    </Box>
  );
}

export function PageSkeleton() {
  return (
    <Box>
      <Skeleton width="30%" height={40} sx={{ mb: 1 }} />
      <Skeleton width="50%" height={24} sx={{ mb: 3 }} />
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Skeleton variant="rounded" width={200} height={40} />
          <Skeleton variant="rounded" width={120} height={40} />
        </Box>
        <Skeleton variant="rounded" height={400} />
      </Paper>
    </Box>
  );
}

export default function LoadingSkeleton({ variant = 'table', rows = 5, columns = 5 }: LoadingSkeletonProps) {
  switch (variant) {
    case 'table':
      return <TableSkeleton rows={rows} columns={columns} />;
    case 'card':
      return <CardSkeleton />;
    case 'form':
      return <FormSkeleton />;
    default:
      return <Skeleton />;
  }
}
