'use client';

import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
  Divider,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  DarkMode,
  LightMode,
  Search,
  Person,
  Settings,
  Logout,
  Help,
} from '@mui/icons-material';
import { useState } from 'react';
import { useThemeStore, useNotificationsStore } from '@/store';
import { DRAWER_WIDTH, COLLAPSED_DRAWER_WIDTH, HEADER_HEIGHT, MOBILE_HEADER_HEIGHT } from '@/lib/navigation';
import NotificationsPanel from './NotificationsPanel';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export default function Header({ onMenuClick, sidebarCollapsed }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleTheme } = useThemeStore();
  const { unreadCount } = useNotificationsStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const drawerWidth = isMobile ? 0 : (sidebarCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: MOBILE_HEADER_HEIGHT, md: HEADER_HEIGHT },
            px: { xs: 2, sm: 3 },
          }}
        >
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open menu"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 2, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Search */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              maxWidth: { xs: '100%', sm: 400 },
              mr: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                width: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                },
              }}
            >
              <Search sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Search...
              </Typography>
              <Box sx={{ ml: 'auto', display: { xs: 'none', sm: 'flex' }, gap: 0.5 }}>
                <Box
                  sx={{
                    px: 0.75,
                    py: 0.25,
                    borderRadius: 1,
                    bgcolor: theme.palette.divider,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                  }}
                >
                  ⌘K
                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Theme toggle */}
            <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
              <IconButton onClick={toggleTheme} sx={{ color: 'text.primary' }}>
                {mode === 'dark' ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                onClick={() => setNotificationsPanelOpen(true)}
                sx={{ color: 'text.primary' }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile */}
            <Tooltip title="Account">
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ p: 0.5 }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {/* TODO: Replace with dynamic user initials from auth state */}
                  AD
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {/* TODO: Replace with dynamic user data from auth state */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Admin User
          </Typography>
          <Typography variant="caption" color="text.secondary">
            admin@wekonsole.local
          </Typography>
        </Box>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Help fontSize="small" />
          </ListItemIcon>
          Help
        </MenuItem>
        <Divider />
        <MenuItem sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Panel */}
      <NotificationsPanel
        open={notificationsPanelOpen}
        onClose={() => setNotificationsPanelOpen(false)}
      />
    </>
  );
}
