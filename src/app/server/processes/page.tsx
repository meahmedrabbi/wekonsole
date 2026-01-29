'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Card,
  CardContent,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import {
  Stop,
  Refresh,
  Visibility,
  Search,
} from '@mui/icons-material';
import { DataTable, Column, ConfirmDialog } from '@/components/ui';
import { useToast } from '@/components/providers';

interface Process {
  pid: number;
  name: string;
  user: string;
  cpu: number;
  memory: number;
  status: string;
  command: string;
  startTime: string;
}

// Mock process data
const generateMockProcesses = (): Process[] => [
  { pid: 1, name: 'systemd', user: 'root', cpu: 0.1, memory: 0.5, status: 'running', command: '/sbin/init', startTime: '2024-01-01 00:00:00' },
  { pid: 2, name: 'kthreadd', user: 'root', cpu: 0.0, memory: 0.0, status: 'running', command: '[kthreadd]', startTime: '2024-01-01 00:00:00' },
  { pid: 456, name: 'nginx', user: 'www-data', cpu: 2.3, memory: 1.2, status: 'running', command: 'nginx: master process /usr/sbin/nginx', startTime: '2024-01-15 10:30:00' },
  { pid: 457, name: 'nginx', user: 'www-data', cpu: 0.5, memory: 0.8, status: 'running', command: 'nginx: worker process', startTime: '2024-01-15 10:30:00' },
  { pid: 789, name: 'mysqld', user: 'mysql', cpu: 8.7, memory: 12.5, status: 'running', command: '/usr/sbin/mysqld', startTime: '2024-01-15 10:31:00' },
  { pid: 1234, name: 'node', user: 'deploy', cpu: 15.2, memory: 8.3, status: 'running', command: 'node /var/www/app/server.js', startTime: '2024-01-20 14:00:00' },
  { pid: 1567, name: 'redis-server', user: 'redis', cpu: 1.2, memory: 2.1, status: 'running', command: '/usr/bin/redis-server 127.0.0.1:6379', startTime: '2024-01-15 10:32:00' },
  { pid: 2345, name: 'postgres', user: 'postgres', cpu: 0.0, memory: 3.2, status: 'sleeping', command: 'postgres: checkpointer', startTime: '2024-01-15 10:33:00' },
  { pid: 3456, name: 'sshd', user: 'root', cpu: 0.0, memory: 0.3, status: 'running', command: 'sshd: /usr/sbin/sshd -D', startTime: '2024-01-01 00:01:00' },
  { pid: 4567, name: 'cron', user: 'root', cpu: 0.0, memory: 0.1, status: 'running', command: '/usr/sbin/cron -f', startTime: '2024-01-01 00:01:00' },
  { pid: 5678, name: 'docker', user: 'root', cpu: 5.4, memory: 6.2, status: 'running', command: '/usr/bin/dockerd -H fd://', startTime: '2024-01-15 10:35:00' },
  { pid: 6789, name: 'containerd', user: 'root', cpu: 2.1, memory: 1.8, status: 'running', command: '/usr/bin/containerd', startTime: '2024-01-15 10:35:00' },
  { pid: 7890, name: 'php-fpm', user: 'www-data', cpu: 3.5, memory: 4.2, status: 'running', command: 'php-fpm: pool www', startTime: '2024-01-15 10:36:00' },
  { pid: 8901, name: 'fail2ban', user: 'root', cpu: 0.1, memory: 0.4, status: 'running', command: '/usr/bin/python3 /usr/bin/fail2ban-server', startTime: '2024-01-15 10:37:00' },
  { pid: 9012, name: 'rsyslogd', user: 'syslog', cpu: 0.0, memory: 0.2, status: 'running', command: '/usr/sbin/rsyslogd -n', startTime: '2024-01-01 00:01:00' },
];

export default function ProcessesPage() {
  const theme = useTheme();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [killDialogOpen, setKillDialogOpen] = useState(false);
  const [processToKill, setProcessToKill] = useState<Process | null>(null);
  const [killing, setKilling] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);

  const fetchProcesses = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProcesses(generateMockProcesses());
      showInfo('Process list refreshed');
    } catch {
      showError('Failed to fetch processes');
    } finally {
      setLoading(false);
    }
  }, [showInfo, showError]);

  useEffect(() => {
    fetchProcesses();
  }, []);

  const handleKillProcess = async () => {
    if (!processToKill) return;
    
    setKilling(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProcesses((prev) => prev.filter((p) => p.pid !== processToKill.pid));
      showSuccess(`Process ${processToKill.name} (PID: ${processToKill.pid}) terminated`);
      setKillDialogOpen(false);
      setProcessToKill(null);
    } catch {
      showError('Failed to kill process');
    } finally {
      setKilling(false);
    }
  };

  const openKillDialog = (process: Process) => {
    setProcessToKill(process);
    setKillDialogOpen(true);
  };

  const openDetailsDialog = (process: Process) => {
    setSelectedProcess(process);
    setDetailsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'success';
      case 'sleeping':
        return 'info';
      case 'stopped':
        return 'warning';
      case 'zombie':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns: Column<Process>[] = [
    {
      id: 'pid',
      label: 'PID',
      minWidth: 80,
      sortable: true,
    },
    {
      id: 'name',
      label: 'Name',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Typography variant="body2" fontWeight={600}>
          {String(value)}
        </Typography>
      ),
    },
    {
      id: 'user',
      label: 'User',
      minWidth: 100,
      sortable: true,
    },
    {
      id: 'cpu',
      label: 'CPU %',
      minWidth: 100,
      sortable: true,
      format: (value) => {
        const cpuValue = Number(value);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(cpuValue, 100)}
              color={cpuValue > 50 ? 'error' : cpuValue > 25 ? 'warning' : 'primary'}
              sx={{ width: 50, height: 6, borderRadius: 1 }}
            />
            <Typography variant="body2">{cpuValue.toFixed(1)}%</Typography>
          </Box>
        );
      },
    },
    {
      id: 'memory',
      label: 'Memory %',
      minWidth: 100,
      sortable: true,
      format: (value) => {
        const memValue = Number(value);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(memValue, 100)}
              color={memValue > 50 ? 'error' : memValue > 25 ? 'warning' : 'secondary'}
              sx={{ width: 50, height: 6, borderRadius: 1 }}
            />
            <Typography variant="body2">{memValue.toFixed(1)}%</Typography>
          </Box>
        );
      },
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      format: (value) => (
        <Chip
          label={String(value)}
          size="small"
          color={getStatusColor(String(value))}
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      id: 'command',
      label: 'Command',
      minWidth: 200,
      sortable: false,
      mobileShow: false,
      format: (value) => (
        <Typography
          variant="body2"
          sx={{
            maxWidth: 300,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={String(value)}
        >
          {String(value)}
        </Typography>
      ),
    },
  ];

  const renderActions = (row: Process) => (
    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
      <Tooltip title="View Details">
        <IconButton size="small" onClick={() => openDetailsDialog(row)}>
          <Visibility fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Kill Process">
        <IconButton
          size="small"
          color="error"
          onClick={() => openKillDialog(row)}
          disabled={row.pid === 1}
        >
          <Stop fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const mobileCardRender = (row: Process, actions?: React.ReactNode) => (
    <Card variant="outlined">
      <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              PID: {row.pid} | User: {row.user}
            </Typography>
          </Box>
          <Chip
            label={row.status}
            size="small"
            color={getStatusColor(row.status)}
            sx={{ textTransform: 'capitalize' }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">CPU</Typography>
            <Typography variant="body2" fontWeight={500}>{row.cpu.toFixed(1)}%</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Memory</Typography>
            <Typography variant="body2" fontWeight={500}>{row.memory.toFixed(1)}%</Typography>
          </Box>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {row.command}
        </Typography>
        {actions && (
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {actions}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Process Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and manage running processes on your server
        </Typography>
      </Box>

      {/* Process Table */}
      <DataTable
        columns={columns}
        data={processes}
        loading={loading}
        title={`${processes.length} Processes`}
        searchPlaceholder="Search by name, PID, or user..."
        onRefresh={fetchProcesses}
        getRowId={(row) => row.pid}
        actions={renderActions}
        emptyMessage="No processes found"
        mobileCardRender={mobileCardRender}
      />

      {/* Kill Process Dialog */}
      <ConfirmDialog
        open={killDialogOpen}
        onClose={() => setKillDialogOpen(false)}
        onConfirm={handleKillProcess}
        title="Kill Process"
        message={`Are you sure you want to terminate ${processToKill?.name} (PID: ${processToKill?.pid})? This action cannot be undone.`}
        confirmText="Kill Process"
        variant="error"
        loading={killing}
      />

      {/* Process Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Process Details</DialogTitle>
        <DialogContent>
          {selectedProcess && (
            <Box sx={{ pt: 1 }}>
              {[
                { label: 'PID', value: selectedProcess.pid },
                { label: 'Name', value: selectedProcess.name },
                { label: 'User', value: selectedProcess.user },
                { label: 'CPU Usage', value: `${selectedProcess.cpu.toFixed(1)}%` },
                { label: 'Memory Usage', value: `${selectedProcess.memory.toFixed(1)}%` },
                { label: 'Status', value: selectedProcess.status },
                { label: 'Start Time', value: selectedProcess.startTime },
                { label: 'Command', value: selectedProcess.command },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: 'flex',
                    py: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ width: 120, flexShrink: 0 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="body2" fontWeight={500} sx={{ wordBreak: 'break-all' }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          {selectedProcess && selectedProcess.pid !== 1 && (
            <Button
              color="error"
              onClick={() => {
                setDetailsDialogOpen(false);
                openKillDialog(selectedProcess);
              }}
            >
              Kill Process
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
