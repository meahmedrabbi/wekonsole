'use client';

import { Box, Typography, useTheme } from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';

interface LogoProps {
  collapsed?: boolean;
}

export default function Logo({ collapsed = false }: LogoProps) {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        py: 0.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: 1.5,
          bgcolor: 'primary.main',
        }}
      >
        <TerminalIcon sx={{ color: 'white', fontSize: 20 }} />
      </Box>
      {!collapsed && (
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            letterSpacing: '-0.01em',
          }}
        >
          WeKonsole
        </Typography>
      )}
    </Box>
  );
}
