'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Computer,
  Schedule,
  Memory,
  Storage,
  Speed,
  Thermostat,
  PowerSettingsNew,
  Refresh,
  Save,
  RestartAlt,
  PlayArrow,
  Stop,
} from '@mui/icons-material';
import { useToast } from '@/components/providers';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ConfirmDialog, DataTable, Column } from '@/components/ui';
import Link from 'next/link';

interface ServerInfo {
  hostname: string;
  timezone: string;
  os: string;
  kernel: string;
  uptime: number;
  cpuModel: string;
  cpuCores: number;
  cpuUsage: number;
  cpuTemp: number;
  memoryTotal: number;
  memoryUsed: number;
  swapTotal: number;
  swapUsed: number;
  diskTotal: number;
  diskUsed: number;
}

interface Service {
  name: string;
  status: 'running' | 'stopped' | 'error';
  enabled: boolean;
  port?: number;
  memory: number;
  cpu: number;
}

// Validation schema
const serverSettingsSchema = z.object({
  hostname: z
    .string()
    .min(1, 'Hostname is required')
    .max(63, 'Hostname must be less than 64 characters')
    .regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/, 'Invalid hostname format'),
  timezone: z.string().min(1, 'Timezone is required'),
});

type ServerSettingsForm = z.infer<typeof serverSettingsSchema>;

// Mock data
const mockServerInfo: ServerInfo = {
  hostname: 'wekonsole-server',
  timezone: 'America/New_York',
  os: 'Ubuntu 24.04 LTS',
  kernel: '6.5.0-35-generic',
  uptime: 1234567,
  cpuModel: 'Intel Xeon E5-2680 v4',
  cpuCores: 8,
  cpuUsage: 23.5,
  cpuTemp: 45,
  memoryTotal: 16,
  memoryUsed: 6.2,
  swapTotal: 8,
  swapUsed: 0.5,
  diskTotal: 500,
  diskUsed: 234,
};

const mockServices: Service[] = [
  { name: 'nginx', status: 'running', enabled: true, port: 80, memory: 45, cpu: 2.3 },
  { name: 'mysql', status: 'running', enabled: true, port: 3306, memory: 512, cpu: 8.7 },
  { name: 'redis', status: 'running', enabled: true, port: 6379, memory: 128, cpu: 1.2 },
  { name: 'php-fpm', status: 'running', enabled: true, port: 9000, memory: 256, cpu: 3.5 },
  { name: 'postgresql', status: 'stopped', enabled: false, port: 5432, memory: 0, cpu: 0 },
  { name: 'docker', status: 'running', enabled: true, memory: 890, cpu: 12.5 },
];

const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Australia/Sydney',
  'UTC',
];

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

export default function ServerPage() {
  const { showSuccess, showError, showWarning } = useToast();
  
  const [serverInfo, setServerInfo] = useState<ServerInfo>(mockServerInfo);
  const [services, setServices] = useState<Service[]>(mockServices);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rebootDialogOpen, setRebootDialogOpen] = useState(false);
  const [shutdownDialogOpen, setShutdownDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [serviceAction, setServiceAction] = useState<{ service: string; action: string } | null>(null);

  const form = useForm<ServerSettingsForm>({
    resolver: zodResolver(serverSettingsSchema),
    defaultValues: {
      hostname: serverInfo.hostname,
      timezone: serverInfo.timezone,
    },
  });

  const fetchServerInfo = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setServerInfo(mockServerInfo);
      setServices(mockServices);
      form.reset({
        hostname: mockServerInfo.hostname,
        timezone: mockServerInfo.timezone,
      });
    } catch {
      showError('Failed to fetch server information');
    } finally {
      setLoading(false);
    }
  }, [showError, form]);

  useEffect(() => {
    fetchServerInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveSettings = async (data: ServerSettingsForm) => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setServerInfo((prev) => ({
        ...prev,
        hostname: data.hostname,
        timezone: data.timezone,
      }));
      showSuccess('Server settings saved successfully');
    } catch {
      showError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReboot = async () => {
    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showWarning('Server is rebooting... This may take a few minutes.');
      setRebootDialogOpen(false);
    } catch {
      showError('Failed to reboot server');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShutdown = async () => {
    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showWarning('Server is shutting down...');
      setShutdownDialogOpen(false);
    } catch {
      showError('Failed to shutdown server');
    } finally {
      setActionLoading(false);
    }
  };

  const handleServiceAction = async (serviceName: string, action: 'start' | 'stop' | 'restart') => {
    setServiceAction({ service: serviceName, action });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setServices((prev) =>
        prev.map((s) => {
          if (s.name === serviceName) {
            if (action === 'start') {
              return { ...s, status: 'running' as const, cpu: Math.random() * 10, memory: Math.random() * 200 + 50 };
            } else if (action === 'stop') {
              return { ...s, status: 'stopped' as const, cpu: 0, memory: 0 };
            } else {
              return { ...s, status: 'running' as const };
            }
          }
          return s;
        })
      );
      showSuccess(`Service ${serviceName} ${action === 'restart' ? 'restarted' : action === 'start' ? 'started' : 'stopped'}`);
    } catch {
      showError(`Failed to ${action} ${serviceName}`);
    } finally {
      setServiceAction(null);
    }
  };

  const serviceColumns: Column<Service>[] = [
    {
      id: 'name',
      label: 'Service',
      minWidth: 120,
      format: (value) => (
        <Typography variant="body2" fontWeight={600}>
          {String(value)}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      format: (value) => (
        <Chip
          label={String(value)}
          size="small"
          color={value === 'running' ? 'success' : value === 'stopped' ? 'default' : 'error'}
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      id: 'port',
      label: 'Port',
      minWidth: 80,
      mobileShow: false,
      format: (value) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {value ? String(value) : '-'}
        </Typography>
      ),
    },
    {
      id: 'cpu',
      label: 'CPU %',
      minWidth: 100,
      mobileShow: false,
      format: (value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(Number(value), 100)}
            sx={{ width: 50, height: 6, borderRadius: 1 }}
          />
          <Typography variant="body2">{Number(value).toFixed(1)}%</Typography>
        </Box>
      ),
    },
    {
      id: 'memory',
      label: 'Memory',
      minWidth: 100,
      mobileShow: false,
      format: (value) => (
        <Typography variant="body2">
          {Number(value) > 0 ? `${Number(value)} MB` : '-'}
        </Typography>
      ),
    },
  ];

  const renderServiceActions = (row: Service) => {
    const isLoading = serviceAction?.service === row.name;
    
    return (
      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
        {row.status === 'running' ? (
          <>
            <Tooltip title="Restart">
              <IconButton
                size="small"
                onClick={() => handleServiceAction(row.name, 'restart')}
                disabled={isLoading}
              >
                {isLoading && serviceAction?.action === 'restart' ? (
                  <CircularProgress size={18} />
                ) : (
                  <RestartAlt fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Stop">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleServiceAction(row.name, 'stop')}
                disabled={isLoading}
              >
                {isLoading && serviceAction?.action === 'stop' ? (
                  <CircularProgress size={18} />
                ) : (
                  <Stop fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="Start">
            <IconButton
              size="small"
              color="success"
              onClick={() => handleServiceAction(row.name, 'start')}
              disabled={isLoading}
            >
              {isLoading && serviceAction?.action === 'start' ? (
                <CircularProgress size={18} />
              ) : (
                <PlayArrow fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Server Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and configure your server settings
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={Link}
            href="/server/processes"
            variant="outlined"
            startIcon={<Speed />}
          >
            Processes
          </Button>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<RestartAlt />}
            onClick={() => setRebootDialogOpen(true)}
          >
            Reboot
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<PowerSettingsNew />}
            onClick={() => setShutdownDialogOpen(true)}
          >
            Shutdown
          </Button>
        </Box>
      </Box>

      {/* System Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Speed color="primary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {serverInfo.cpuUsage}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                CPU Usage
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Memory color="secondary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {((serverInfo.memoryUsed / serverInfo.memoryTotal) * 100).toFixed(0)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Memory ({serverInfo.memoryUsed}/{serverInfo.memoryTotal} GB)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Storage color="info" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {((serverInfo.diskUsed / serverInfo.diskTotal) * 100).toFixed(0)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Disk ({serverInfo.diskUsed}/{serverInfo.diskTotal} GB)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Thermostat color="error" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {serverInfo.cpuTemp}°C
              </Typography>
              <Typography variant="caption" color="text.secondary">
                CPU Temperature
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Schedule color="success" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1rem' }}>
                {formatUptime(serverInfo.uptime)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Uptime
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Computer color="warning" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1rem' }}>
                {serverInfo.cpuCores} Cores
              </Typography>
              <Typography variant="caption" color="text.secondary">
                CPU Cores
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Server Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }} variant="outlined">
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Server Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={form.handleSubmit(handleSaveSettings)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Hostname"
                  {...form.register('hostname')}
                  error={!!form.formState.errors.hostname}
                  helperText={form.formState.errors.hostname?.message}
                />
                <Controller
                  name="timezone"
                  control={form.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Timezone</InputLabel>
                      <Select {...field} label="Timezone">
                        {timezones.map((tz) => (
                          <MenuItem key={tz} value={tz}>
                            {tz}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                <TextField
                  fullWidth
                  label="Operating System"
                  value={serverInfo.os}
                  disabled
                />
                <TextField
                  fullWidth
                  label="Kernel"
                  value={serverInfo.kernel}
                  disabled
                />
                <TextField
                  fullWidth
                  label="CPU Model"
                  value={serverInfo.cpuModel}
                  disabled
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={16} /> : <Save />}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>

        {/* Services */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }} variant="outlined">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                System Services
              </Typography>
              <IconButton size="small" onClick={fetchServerInfo}>
                <Refresh />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <DataTable
              columns={serviceColumns}
              data={services}
              loading={loading}
              getRowId={(row) => row.name}
              actions={renderServiceActions}
              emptyMessage="No services found"
              rowsPerPageOptions={[5, 10]}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Reboot Confirmation */}
      <ConfirmDialog
        open={rebootDialogOpen}
        onClose={() => setRebootDialogOpen(false)}
        onConfirm={handleReboot}
        title="Reboot Server"
        message="Are you sure you want to reboot the server? All active connections will be terminated and services will be temporarily unavailable."
        confirmText="Reboot Now"
        variant="warning"
        loading={actionLoading}
      />

      {/* Shutdown Confirmation */}
      <ConfirmDialog
        open={shutdownDialogOpen}
        onClose={() => setShutdownDialogOpen(false)}
        onConfirm={handleShutdown}
        title="Shutdown Server"
        message="Are you sure you want to shutdown the server? You will need physical or remote access to turn it back on."
        confirmText="Shutdown Now"
        variant="error"
        loading={actionLoading}
      />
    </Box>
  );
}
