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
        py: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          boxShadow: `0 4px 14px ${theme.palette.primary.main}40`,
        }}
      >
        <TerminalIcon sx={{ color: 'white', fontSize: 24 }} />
      </Box>
      {!collapsed && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            WeKonsole
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.625rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Server Management
          </Typography>
        </Box>
      )}
    </Box>
  );
}
