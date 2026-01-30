'use client';

import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { useUIStore } from '@/store';
import Sidebar from './Sidebar';
import Header from './Header';
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from '@/lib/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { sidebarCollapsed, mobileMenuOpen, setMobileMenuOpen, closeMobileMenu, toggleSidebarCollapse } = useUIStore();

  const drawerWidth = sidebarCollapsed ? MINI_DRAWER_WIDTH : DRAWER_WIDTH;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {/* Header */}
      <Header
        onMenuClick={() => {
          if (isMobile) {
            setMobileMenuOpen(!mobileMenuOpen);
          } else {
            toggleSidebarCollapse();
          }
        }}
        drawerOpen={!sidebarCollapsed}
      />

      {/* Sidebar */}
      <Sidebar
        open={isMobile ? mobileMenuOpen : true}
        collapsed={isMobile ? false : sidebarCollapsed}
        onClose={closeMobileMenu}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 60 } }} />
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            minHeight: 'calc(100vh - 110px)',
          }}
        >
          {children}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            py: 2,
            px: 3,
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: '0.75rem',
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          WeKonsole - Server Management Dashboard
        </Box>
      </Box>
    </Box>
  );
}
