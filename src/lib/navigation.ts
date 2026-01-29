import { NavItem } from '@/types';

export const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/',
  },
  {
    id: 'server',
    label: 'Server',
    icon: 'dns',
    path: '/server',
    children: [
      {
        id: 'overview',
        label: 'Overview',
        icon: 'info',
        path: '/server/overview',
      },
      {
        id: 'processes',
        label: 'Processes',
        icon: 'memory',
        path: '/server/processes',
      },
      {
        id: 'services',
        label: 'Services',
        icon: 'settings_applications',
        path: '/server/services',
      },
    ],
  },
  {
    id: 'files',
    label: 'File Manager',
    icon: 'folder',
    path: '/files',
  },
  {
    id: 'databases',
    label: 'Databases',
    icon: 'storage',
    path: '/databases',
  },
  {
    id: 'network',
    label: 'Network',
    icon: 'wifi',
    path: '/network',
  },
  {
    id: 'security',
    label: 'Security',
    icon: 'security',
    path: '/security',
  },
  {
    id: 'logs',
    label: 'Logs',
    icon: 'article',
    path: '/logs',
  },
  {
    id: 'backups',
    label: 'Backups',
    icon: 'backup',
    path: '/backups',
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'people',
    path: '/users',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    path: '/settings',
  },
];

export const DRAWER_WIDTH = 260;
export const COLLAPSED_DRAWER_WIDTH = 72;
export const HEADER_HEIGHT = 64;
export const MOBILE_HEADER_HEIGHT = 56;
