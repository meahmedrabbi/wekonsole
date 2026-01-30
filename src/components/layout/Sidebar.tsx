'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
  alpha,
} from '@mui/material';
import {
  Dashboard,
  Dns,
  Folder,
  Storage,
  Wifi,
  Security,
  Article,
  Backup,
  People,
  Settings,
  ExpandLess,
  ExpandMore,
  Info,
  Memory,
  FiberManualRecord,
} from '@mui/icons-material';
import { useState } from 'react';
import { Logo } from '@/components/common';
import { navigationGroups, DRAWER_WIDTH, MINI_DRAWER_WIDTH, HEADER_HEIGHT } from '@/lib/navigation';
import type { NavItem } from '@/types';
import type { NavGroup } from '@/lib/navigation';

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  dashboard: <Dashboard fontSize="small" />,
  dns: <Dns fontSize="small" />,
  folder: <Folder fontSize="small" />,
  storage: <Storage fontSize="small" />,
  wifi: <Wifi fontSize="small" />,
  security: <Security fontSize="small" />,
  article: <Article fontSize="small" />,
  backup: <Backup fontSize="small" />,
  people: <People fontSize="small" />,
  settings: <Settings fontSize="small" />,
  info: <Info fontSize="small" />,
  memory: <Memory fontSize="small" />,
};

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
}

function NavItemComponent({
  item,
  collapsed,
  level = 0,
  onClose,
}: {
  item: NavItem;
  collapsed: boolean;
  level?: number;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  // Exact match for root, prefix match for others
  const isActive = item.path === '/'
    ? pathname === '/'
    : pathname === item.path;

  const isParentActive = hasChildren && item.children!.some(
    child => child.path === '/' ? pathname === '/' : pathname === child.path || pathname.startsWith(`${child.path}/`)
  );

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    } else if (isMobile && onClose) {
      onClose();
    }
  };

  const icon = iconMap[item.icon] || <Dashboard fontSize="small" />;

  // Sub-item (child nav item)
  if (level > 0) {
    return (
      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          component={Link}
          href={item.path}
          onClick={isMobile && onClose ? onClose : undefined}
          selected={isActive}
          sx={{
            minHeight: 36,
            px: 2,
            pl: collapsed ? 2 : 5.5,
            borderRadius: 1,
            mx: 1,
            mb: 0.25,
            '&.Mui-selected': {
              color: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.12),
              },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 24, mr: 1.5 }}>
            <FiberManualRecord sx={{ fontSize: isActive ? 8 : 6, color: isActive ? 'primary.main' : 'text.secondary' }} />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.8125rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'primary.main' : 'text.secondary',
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    );
  }

  const buttonContent = (
    <ListItemButton
      component={hasChildren ? 'div' : Link}
      href={hasChildren ? undefined : item.path}
      onClick={handleClick}
      selected={isActive && !hasChildren}
      sx={{
        minHeight: 44,
        px: 2,
        borderRadius: 1,
        mx: 1,
        mb: 0.25,
        justifyContent: collapsed ? 'center' : 'flex-start',
        '&.Mui-selected': {
          color: 'primary.main',
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          '& .MuiListItemIcon-root': {
            color: 'primary.main',
          },
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.12),
          },
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: collapsed ? 0 : 28,
          mr: collapsed ? 0 : 1.5,
          justifyContent: 'center',
          color: isActive || isParentActive ? 'primary.main' : 'text.secondary',
        }}
      >
        {icon}
      </ListItemIcon>
      {!collapsed && (
        <>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: isActive || isParentActive ? 600 : 400,
            }}
          />
          {hasChildren && (
            open ? <ExpandLess sx={{ fontSize: 18, color: 'text.secondary' }} /> : <ExpandMore sx={{ fontSize: 18, color: 'text.secondary' }} />
          )}
        </>
      )}
    </ListItemButton>
  );

  return (
    <>
      <ListItem disablePadding sx={{ display: 'block' }}>
        {collapsed ? (
          <Tooltip title={item.label} placement="right" arrow>
            {buttonContent}
          </Tooltip>
        ) : (
          buttonContent
        )}
      </ListItem>
      {hasChildren && !collapsed && (
        <Collapse in={open || isParentActive} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children!.map((child) => (
              <NavItemComponent
                key={child.id}
                item={child}
                collapsed={collapsed}
                level={level + 1}
                onClose={onClose}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

function NavGroupComponent({
  group,
  collapsed,
  onClose,
}: {
  group: NavGroup;
  collapsed: boolean;
  onClose?: () => void;
}) {
  return (
    <Box sx={{ mb: 1 }}>
      {!collapsed && (
        <Typography
          variant="caption"
          sx={{
            px: 3,
            py: 0.75,
            display: 'block',
            color: 'text.secondary',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '0.6875rem',
          }}
        >
          {group.title}
        </Typography>
      )}
      {collapsed && <Divider sx={{ mx: 1, my: 0.5 }} />}
      <List disablePadding>
        {group.children.map((item) => (
          <NavItemComponent key={item.id} item={item} collapsed={collapsed} onClose={onClose} />
        ))}
      </List>
    </Box>
  );
}

export default function Sidebar({ open, collapsed, onClose }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = collapsed ? MINI_DRAWER_WIDTH : DRAWER_WIDTH;

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          px: collapsed ? 1 : 2.5,
          minHeight: HEADER_HEIGHT,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Logo collapsed={collapsed} />
      </Box>

      {/* Navigation */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          pt: 1.5,
          pb: 2,
          '&::-webkit-scrollbar': {
            width: 5,
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: theme.palette.divider,
            borderRadius: '3px',
          },
        }}
      >
        {navigationGroups.map((group) => (
          <NavGroupComponent key={group.id} group={group} collapsed={collapsed} onClose={onClose} />
        ))}
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
