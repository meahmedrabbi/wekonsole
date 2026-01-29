'use client';

import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useUIStore } from '@/store';
import Sidebar from './Sidebar';
import Header from './Header';
import { HEADER_HEIGHT, MOBILE_HEADER_HEIGHT } from '@/lib/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {
    sidebarOpen,
    sidebarCollapsed,
    mobileMenuOpen,
    toggleSidebar,
    toggleSidebarCollapse,
    setMobileMenuOpen,
    closeMobileMenu,
  } = useUIStore();

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      toggleSidebar();
    }
  };

  const headerHeight = isMobile ? MOBILE_HEADER_HEIGHT : HEADER_HEIGHT;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar
        open={isMobile ? mobileMenuOpen : sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={closeMobileMenu}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          bgcolor: 'background.default',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Header */}
        <Header onMenuClick={handleMenuClick} sidebarCollapsed={sidebarCollapsed} />

        {/* Page content */}
        <Box
          sx={{
            pt: `${headerHeight}px`,
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 3 },
            minHeight: `calc(100vh - ${headerHeight}px)`,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
