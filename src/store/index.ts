import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Theme state
interface ThemeState {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      toggleTheme: () =>
        set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
      setTheme: (mode) => set({ mode }),
    }),
    {
      name: 'wekonsole-theme',
    }
  )
);

// UI state for sidebar and mobile menu
interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleSidebarCollapse: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));

// Server stats (mock data for now)
export interface ServerStats {
  cpu: {
    usage: number;
    cores: number;
    model: string;
    temperature: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
    readSpeed: number;
    writeSpeed: number;
  };
  network: {
    upload: number;
    download: number;
    totalUp: number;
    totalDown: number;
  };
  uptime: number;
  hostname: string;
  os: string;
  kernel: string;
  lastUpdated: Date;
}

interface ServerState {
  stats: ServerStats | null;
  isLoading: boolean;
  error: string | null;
  setStats: (stats: ServerStats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Initial mock data
const mockStats: ServerStats = {
  cpu: {
    usage: 23.5,
    cores: 8,
    model: 'Intel Xeon E5-2680 v4',
    temperature: 45,
  },
  memory: {
    used: 6.2,
    total: 16,
    percentage: 38.75,
  },
  disk: {
    used: 234,
    total: 500,
    percentage: 46.8,
    readSpeed: 125,
    writeSpeed: 87,
  },
  network: {
    upload: 12.5,
    download: 45.3,
    totalUp: 2.4,
    totalDown: 15.7,
  },
  uptime: 1234567,
  hostname: 'wekonsole-server',
  os: 'Ubuntu 24.04 LTS',
  kernel: '6.5.0-35-generic',
  lastUpdated: new Date(),
};

export const useServerStore = create<ServerState>((set) => ({
  stats: mockStats,
  isLoading: false,
  error: null,
  setStats: (stats) => set({ stats, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

// Services state
export interface Service {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error' | 'restarting';
  port?: number;
  memory?: number;
  cpu?: number;
  uptime?: number;
}

interface ServicesState {
  services: Service[];
  isLoading: boolean;
  setServices: (services: Service[]) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
}

const mockServices: Service[] = [
  { id: '1', name: 'nginx', status: 'running', port: 80, memory: 45, cpu: 2.3, uptime: 864000 },
  { id: '2', name: 'mysql', status: 'running', port: 3306, memory: 512, cpu: 8.7, uptime: 864000 },
  { id: '3', name: 'redis', status: 'running', port: 6379, memory: 128, cpu: 1.2, uptime: 864000 },
  { id: '4', name: 'nodejs', status: 'running', port: 3000, memory: 256, cpu: 5.4, uptime: 432000 },
  { id: '5', name: 'postgresql', status: 'stopped', port: 5432 },
  { id: '6', name: 'docker', status: 'running', memory: 890, cpu: 12.5, uptime: 864000 },
];

export const useServicesStore = create<ServicesState>((set) => ({
  services: mockServices,
  isLoading: false,
  setServices: (services) => set({ services }),
  updateService: (id, updates) =>
    set((state) => ({
      services: state.services.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),
}));

// Quick actions state
export interface QuickAction {
  id: string;
  name: string;
  icon: string;
  description: string;
  dangerous?: boolean;
}

const defaultActions: QuickAction[] = [
  { id: '1', name: 'Restart Server', icon: 'refresh', description: 'Restart the server', dangerous: true },
  { id: '2', name: 'Clear Cache', icon: 'cache', description: 'Clear system cache' },
  { id: '3', name: 'Update System', icon: 'update', description: 'Run system updates' },
  { id: '4', name: 'Backup Now', icon: 'backup', description: 'Create a backup' },
  { id: '5', name: 'View Logs', icon: 'logs', description: 'View system logs' },
  { id: '6', name: 'Security Scan', icon: 'security', description: 'Run security scan' },
];

interface QuickActionsState {
  actions: QuickAction[];
  executeAction: (id: string) => Promise<void>;
}

export const useQuickActionsStore = create<QuickActionsState>(() => ({
  actions: defaultActions,
  executeAction: async (_id) => {
    // TODO: Implement actual action execution via API using _id
    // Mock action execution for now
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
}));

// Notifications state
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Backup Complete',
    message: 'System backup completed successfully',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'High Memory Usage',
    message: 'Memory usage exceeded 80% threshold',
    timestamp: new Date(Date.now() - 7200000),
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Updates Available',
    message: '12 system updates are available',
    timestamp: new Date(Date.now() - 86400000),
    read: true,
  },
];

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: initialNotifications,
  unreadCount: initialNotifications.filter((n) => !n.read).length,
  addNotification: (notification) =>
    set((state) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
      };
      return {
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  removeNotification: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: notification && !notification.read
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };
    }),
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
