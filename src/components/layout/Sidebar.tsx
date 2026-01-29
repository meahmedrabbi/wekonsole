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
  useTheme,
  useMediaQuery,
  IconButton,
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
  SettingsApplications,
  Close,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { useState } from 'react';
import { Logo } from '@/components/common';
import { navigationItems, DRAWER_WIDTH, COLLAPSED_DRAWER_WIDTH, HEADER_HEIGHT } from '@/lib/navigation';
import type { NavItem } from '@/types';

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  dashboard: <Dashboard />,
  dns: <Dns />,
  folder: <Folder />,
  storage: <Storage />,
  wifi: <Wifi />,
  security: <Security />,
  article: <Article />,
  backup: <Backup />,
  people: <People />,
  settings: <Settings />,
  info: <Info />,
  memory: <Memory />,
  settings_applications: <SettingsApplications />,
};

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

function NavItemComponent({
  item,
  collapsed,
  level = 0,
}: {
  item: NavItem;
  collapsed: boolean;
  level?: number;
}) {
  const pathname = usePathname();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    }
  };

  const buttonContent = (
    <ListItemButton
      component={hasChildren ? 'div' : Link}
      href={hasChildren ? undefined : item.path}
      onClick={handleClick}
      selected={isActive && !hasChildren}
      sx={{
        borderRadius: 2,
        mx: collapsed ? 0.5 : 1,
        mb: 0.5,
        pl: collapsed ? 1.5 : 2 + level * 2,
        minHeight: 44,
        justifyContent: collapsed ? 'center' : 'flex-start',
        '&.Mui-selected': {
          bgcolor: `${theme.palette.primary.main}15`,
          color: 'primary.main',
          '& .MuiListItemIcon-root': {
            color: 'primary.main',
          },
          '&:hover': {
            bgcolor: `${theme.palette.primary.main}20`,
          },
        },
        '&:hover': {
          bgcolor: theme.palette.action.hover,
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: collapsed ? 0 : 36,
          justifyContent: 'center',
          color: isActive ? 'primary.main' : 'text.secondary',
        }}
      >
        {iconMap[item.icon] || <Dashboard />}
      </ListItemIcon>
      {!collapsed && (
        <>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 500,
            }}
          />
          {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
        </>
      )}
    </ListItemButton>
  );

  return (
    <>
      <ListItem disablePadding>
        {collapsed ? (
          <Tooltip title={item.label} placement="right" arrow>
            {buttonContent}
          </Tooltip>
        ) : (
          buttonContent
        )}
      </ListItem>
      {hasChildren && !collapsed && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children!.map((child) => (
              <NavItemComponent
                key={child.id}
                item={child}
                collapsed={collapsed}
                level={level + 1}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

export default function Sidebar({ open, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const drawerWidth = collapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          p: 2,
          minHeight: HEADER_HEIGHT,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Logo collapsed={collapsed} />
        {isMobile && (
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          py: 2,
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: theme.palette.divider,
            borderRadius: 3,
          },
        }}
      >
        <List>
          {navigationItems.map((item) => (
            <NavItemComponent key={item.id} item={item} collapsed={collapsed} />
          ))}
        </List>
      </Box>

      {/* Footer with collapse button */}
      {!isMobile && (
        <Box
          sx={{
            p: 1,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            justifyContent: collapsed ? 'center' : 'flex-end',
          }}
        >
          <Tooltip title={collapsed ? 'Expand' : 'Collapse'} placement="right">
            <IconButton onClick={onToggleCollapse} size="small">
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </Tooltip>
        </Box>
      )}
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
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
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
