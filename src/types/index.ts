// Navigation types
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
  children?: NavItem[];
}

// Server types
export interface SystemInfo {
  hostname: string;
  os: string;
  kernel: string;
  uptime: number;
  architecture: string;
}

export interface CPUInfo {
  model: string;
  cores: number;
  threads: number;
  usage: number;
  temperature: number;
  frequency: number;
}

export interface MemoryInfo {
  total: number;
  used: number;
  free: number;
  cached: number;
  buffers: number;
  percentage: number;
}

export interface DiskInfo {
  device: string;
  mountPoint: string;
  filesystem: string;
  total: number;
  used: number;
  free: number;
  percentage: number;
}

export interface NetworkInterface {
  name: string;
  ipAddress: string;
  macAddress: string;
  status: 'up' | 'down';
  rxBytes: number;
  txBytes: number;
  rxSpeed: number;
  txSpeed: number;
}

// Process types
export interface Process {
  pid: number;
  name: string;
  user: string;
  cpu: number;
  memory: number;
  status: string;
  startTime: Date;
  command: string;
}

// File Manager types
export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory' | 'symlink';
  size: number;
  permissions: string;
  owner: string;
  group: string;
  modified: Date;
  created: Date;
}

// User types
export interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'user' | 'viewer';
  lastLogin?: Date;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Chart data types
export interface ChartDataPoint {
  timestamp: Date;
  value: number;
}

export interface TimeSeriesData {
  label: string;
  data: ChartDataPoint[];
  color?: string;
}

// Dashboard widget types
export interface DashboardWidget {
  id: string;
  type: 'stat' | 'chart' | 'list' | 'status';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
}
