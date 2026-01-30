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
  alpha,
  Breadcrumbs,
} from '@mui/material';
import {
  Menu as MenuIcon,
  MenuOpen,
  Notifications,
  DarkMode,
  LightMode,
  Search,
  Person,
  Settings,
  Logout,
  Help,
  NavigateNext,
} from '@mui/icons-material';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useThemeStore, useNotificationsStore } from '@/store';
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from '@/lib/navigation';
import NotificationsPanel from './NotificationsPanel';

interface HeaderProps {
  onMenuClick: () => void;
  drawerOpen: boolean;
}

function getBreadcrumbs(pathname: string): { label: string; path: string }[] {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; path: string }[] = [];
  
  const labelMap: Record<string, string> = {
    server: 'Server',
    processes: 'Processes',
    files: 'File Manager',
    network: 'Network',
    logs: 'Logs',
    databases: 'Databases',
    backups: 'Backups',
    security: 'Security',
    users: 'Users',
    settings: 'Settings',
  };

  parts.forEach((part, index) => {
    const path = '/' + parts.slice(0, index + 1).join('/');
    crumbs.push({
      label: labelMap[part] || part.charAt(0).toUpperCase() + part.slice(1),
      path,
    });
  });

  return crumbs;
}

export default function Header({ onMenuClick, drawerOpen }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();
  const { mode, toggleTheme } = useThemeStore();
  const { unreadCount } = useNotificationsStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

  const breadcrumbs = getBreadcrumbs(pathname);

  const drawerWidth = isMobile ? 0 : (drawerOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 60 }, px: { xs: 2, sm: 3 } }}>
          {/* Menu toggle */}
          <IconButton
            aria-label="toggle drawer"
            onClick={onMenuClick}
            edge="start"
            sx={{
              color: 'text.primary',
              mr: 1,
            }}
          >
            {isMobile || !drawerOpen ? <MenuIcon /> : <MenuOpen />}
          </IconButton>

          {/* Breadcrumbs */}
          <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }}>
            <Breadcrumbs
              separator={<NavigateNext sx={{ fontSize: 16, color: 'text.secondary' }} />}
              sx={{ '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap' } }}
            >
              <Typography
                component={Link}
                href="/"
                variant="body2"
                sx={{
                  color: breadcrumbs.length === 0 ? 'text.primary' : 'text.secondary',
                  fontWeight: breadcrumbs.length === 0 ? 600 : 400,
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Dashboard
              </Typography>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return isLast ? (
                  <Typography
                    key={crumb.path}
                    variant="body2"
                    sx={{ color: 'text.primary', fontWeight: 600 }}
                  >
                    {crumb.label}
                  </Typography>
                ) : (
                  <Typography
                    key={crumb.path}
                    component={Link}
                    href={crumb.path}
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {crumb.label}
                  </Typography>
                );
              })}
            </Breadcrumbs>
          </Box>

          {/* Mobile title */}
          <Box sx={{ flex: 1, display: { xs: 'block', sm: 'none' } }}>
            <Typography variant="subtitle1" fontWeight={600} color="text.primary" noWrap>
              {breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : 'Dashboard'}
            </Typography>
          </Box>

          {/* Right actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* Search */}
            <Tooltip title="Search">
              <IconButton sx={{ color: 'text.secondary' }}>
                <Search />
              </IconButton>
            </Tooltip>

            {/* Theme toggle */}
            <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
              <IconButton onClick={toggleTheme} sx={{ color: 'text.secondary' }}>
                {mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                onClick={() => setNotificationsPanelOpen(true)}
                sx={{ color: 'text.secondary' }}
              >
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  variant="dot"
                  invisible={unreadCount === 0}
                >
                  <Notifications fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile */}
            <Tooltip title="Profile">
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ p: 0.5, ml: 0.5 }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
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
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 4px 24px rgba(0, 0, 0, 0.4)'
                : '0 4px 24px rgba(0, 0, 0, 0.08)',
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Admin User
          </Typography>
          <Typography variant="caption" color="text.secondary">
            admin@wekonsole.local
          </Typography>
        </Box>
        <Divider />
        <MenuItem>
          <ListItemIcon><Person fontSize="small" /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem>
          <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem>
          <ListItemIcon><Help fontSize="small" /></ListItemIcon>
          Help
        </MenuItem>
        <Divider />
        <MenuItem sx={{ color: 'error.main' }}>
          <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
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
