import { NavItem } from '@/types';

// Navigation configuration - Mantis-style with groups
export interface NavGroup {
  id: string;
  title: string;
  type: 'group';
  children: NavItem[];
}

export const navigationGroups: NavGroup[] = [
  {
    id: 'dashboard-group',
    title: 'Dashboard',
    type: 'group',
    children: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        path: '/',
      },
    ],
  },
  {
    id: 'server-group',
    title: 'Server',
    type: 'group',
    children: [
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
            path: '/server',
          },
          {
            id: 'processes',
            label: 'Processes',
            icon: 'memory',
            path: '/server/processes',
          },
        ],
      },
      {
        id: 'network',
        label: 'Network',
        icon: 'wifi',
        path: '/network',
      },
      {
        id: 'logs',
        label: 'Logs',
        icon: 'article',
        path: '/logs',
      },
    ],
  },
  {
    id: 'management-group',
    title: 'Management',
    type: 'group',
    children: [
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
        id: 'backups',
        label: 'Backups',
        icon: 'backup',
        path: '/backups',
      },
    ],
  },
  {
    id: 'settings-group',
    title: 'Settings',
    type: 'group',
    children: [
      {
        id: 'security',
        label: 'Security',
        icon: 'security',
        path: '/security',
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
    ],
  },
];

// Flat list for backwards compatibility
export const navigationItems: NavItem[] = navigationGroups.flatMap(g => g.children);

export const DRAWER_WIDTH = 260;
export const MINI_DRAWER_WIDTH = 60;
export const HEADER_HEIGHT = 60;
export const MOBILE_HEADER_HEIGHT = 56;
