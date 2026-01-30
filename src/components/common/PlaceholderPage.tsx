'use client';

import { Box, Typography, Paper, alpha, useTheme } from '@mui/material';
import { Construction } from '@mui/icons-material';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  const theme = useTheme();
  
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          borderRadius: 3,
          borderStyle: 'dashed',
          bgcolor: alpha(theme.palette.primary.main, 0.02),
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
            mb: 2,
          }}
        >
          <Construction sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
          This feature is currently under development. Check back soon for updates.
        </Typography>
      </Paper>
    </Box>
  );
}
