'use client';

import { Box, Typography, alpha, useTheme } from '@mui/material';
import { Construction } from '@mui/icons-material';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>

      <Box
        sx={{
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          borderRadius: 2,
          border: `1px dashed ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.primary.main, 0.02),
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            color: 'primary.main',
            mb: 2,
          }}
        >
          <Construction sx={{ fontSize: 36 }} />
        </Box>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
          Coming Soon
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
          This feature is currently under development. Check back soon for updates.
        </Typography>
      </Box>
    </Box>
  );
}
