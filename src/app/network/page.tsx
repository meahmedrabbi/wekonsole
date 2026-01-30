'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Wifi,
  WifiOff,
  Router,
  CloudUpload,
  CloudDownload,
} from '@mui/icons-material';
import { DataTable, Column } from '@/components/ui';
import { useToast } from '@/components/providers';

interface NetworkInterface {
  name: string;
  ipAddress: string;
  macAddress: string;
  status: 'up' | 'down';
  rxBytes: number;
  txBytes: number;
  rxSpeed: number;
  txSpeed: number;
}

interface ActiveConnection {
  id: string;
  protocol: string;
  localAddress: string;
  localPort: number;
  remoteAddress: string;
  remotePort: number;
  state: string;
  process: string;
  pid: number;
}

interface ListeningPort {
  port: number;
  protocol: string;
  service: string;
  pid: number;
  process: string;
  address: string;
}

// Mock data
const mockInterfaces: NetworkInterface[] = [
  { name: 'eth0', ipAddress: '192.168.1.100', macAddress: '00:1A:2B:3C:4D:5E', status: 'up', rxBytes: 15728640000, txBytes: 2621440000, rxSpeed: 45.3, txSpeed: 12.5 },
  { name: 'eth1', ipAddress: '10.0.0.1', macAddress: '00:1A:2B:3C:4D:5F', status: 'up', rxBytes: 1073741824, txBytes: 536870912, rxSpeed: 5.2, txSpeed: 2.1 },
  { name: 'lo', ipAddress: '127.0.0.1', macAddress: '00:00:00:00:00:00', status: 'up', rxBytes: 524288000, txBytes: 524288000, rxSpeed: 0.1, txSpeed: 0.1 },
  { name: 'docker0', ipAddress: '172.17.0.1', macAddress: '02:42:8E:4F:2A:1B', status: 'up', rxBytes: 268435456, txBytes: 134217728, rxSpeed: 1.5, txSpeed: 0.8 },
];

const mockConnections: ActiveConnection[] = [
  { id: '1', protocol: 'TCP', localAddress: '0.0.0.0', localPort: 22, remoteAddress: '192.168.1.50', remotePort: 52431, state: 'ESTABLISHED', process: 'sshd', pid: 1234 },
  { id: '2', protocol: 'TCP', localAddress: '0.0.0.0', localPort: 80, remoteAddress: '203.0.113.45', remotePort: 43521, state: 'ESTABLISHED', process: 'nginx', pid: 456 },
  { id: '3', protocol: 'TCP', localAddress: '0.0.0.0', localPort: 443, remoteAddress: '198.51.100.23', remotePort: 58321, state: 'ESTABLISHED', process: 'nginx', pid: 456 },
  { id: '4', protocol: 'TCP', localAddress: '127.0.0.1', localPort: 3306, remoteAddress: '127.0.0.1', remotePort: 42156, state: 'ESTABLISHED', process: 'node', pid: 1567 },
  { id: '5', protocol: 'TCP', localAddress: '0.0.0.0', localPort: 22, remoteAddress: '10.0.0.50', remotePort: 38421, state: 'TIME_WAIT', process: 'sshd', pid: 1234 },
];

const mockPorts: ListeningPort[] = [
  { port: 22, protocol: 'TCP', service: 'SSH', pid: 1234, process: 'sshd', address: '0.0.0.0' },
  { port: 80, protocol: 'TCP', service: 'HTTP', pid: 456, process: 'nginx', address: '0.0.0.0' },
  { port: 443, protocol: 'TCP', service: 'HTTPS', pid: 456, process: 'nginx', address: '0.0.0.0' },
  { port: 3000, protocol: 'TCP', service: 'Node.js', pid: 1567, process: 'node', address: '0.0.0.0' },
  { port: 3306, protocol: 'TCP', service: 'MySQL', pid: 789, process: 'mysqld', address: '127.0.0.1' },
  { port: 5432, protocol: 'TCP', service: 'PostgreSQL', pid: 890, process: 'postgres', address: '127.0.0.1' },
  { port: 6379, protocol: 'TCP', service: 'Redis', pid: 901, process: 'redis-server', address: '127.0.0.1' },
  { port: 9000, protocol: 'TCP', service: 'PHP-FPM', pid: 1012, process: 'php-fpm', address: '127.0.0.1' },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function NetworkPage() {
  const { showSuccess, showError, showInfo } = useToast();
  
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([]);
  const [connections, setConnections] = useState<ActiveConnection[]>([]);
  const [ports, setPorts] = useState<ListeningPort[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setInterfaces(mockInterfaces);
      setConnections(mockConnections);
      setPorts(mockPorts);
    } catch {
      showError('Failed to fetch network data');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    fetchData();
    showInfo('Network data refreshed');
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'ESTABLISHED':
        return 'success';
      case 'LISTEN':
        return 'info';
      case 'TIME_WAIT':
        return 'warning';
      case 'CLOSE_WAIT':
        return 'error';
      default:
        return 'default';
    }
  };

  // Interface columns
  const interfaceColumns: Column<NetworkInterface>[] = [
    {
      id: 'name',
      label: 'Interface',
      minWidth: 100,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {row.status === 'up' ? <Wifi color="success" /> : <WifiOff color="error" />}
          <Typography variant="body2" fontWeight={600}>
            {String(value)}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'ipAddress',
      label: 'IP Address',
      minWidth: 130,
      format: (value) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {String(value)}
        </Typography>
      ),
    },
    {
      id: 'macAddress',
      label: 'MAC Address',
      minWidth: 150,
      mobileShow: false,
      format: (value) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
          {String(value)}
        </Typography>
      ),
    },
    {
      id: 'rxSpeed',
      label: 'Download',
      minWidth: 100,
      format: (value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CloudDownload fontSize="small" color="primary" />
          <Typography variant="body2">{Number(value).toFixed(1)} MB/s</Typography>
        </Box>
      ),
    },
    {
      id: 'txSpeed',
      label: 'Upload',
      minWidth: 100,
      format: (value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CloudUpload fontSize="small" color="secondary" />
          <Typography variant="body2">{Number(value).toFixed(1)} MB/s</Typography>
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 80,
      format: (value) => (
        <Chip
          label={String(value).toUpperCase()}
          size="small"
          color={value === 'up' ? 'success' : 'error'}
        />
      ),
    },
  ];

  // Listening ports columns
  const portColumns: Column<ListeningPort>[] = [
    {
      id: 'port',
      label: 'Port',
      minWidth: 80,
      sortable: true,
      format: (value) => (
        <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
          {String(value)}
        </Typography>
      ),
    },
    {
      id: 'protocol',
      label: 'Protocol',
      minWidth: 80,
      format: (value) => (
        <Chip label={String(value)} size="small" variant="outlined" />
      ),
    },
    {
      id: 'service',
      label: 'Service',
      minWidth: 100,
      sortable: true,
    },
    {
      id: 'process',
      label: 'Process',
      minWidth: 120,
      format: (value, row) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {String(value)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            PID: {row.pid}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'address',
      label: 'Bind Address',
      minWidth: 120,
      mobileShow: false,
      format: (value) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
          {String(value)}
        </Typography>
      ),
    },
  ];

  // Active connections columns
  const connectionColumns: Column<ActiveConnection>[] = [
    {
      id: 'protocol',
      label: 'Protocol',
      minWidth: 80,
      format: (value) => (
        <Chip label={String(value)} size="small" variant="outlined" />
      ),
    },
    {
      id: 'localPort',
      label: 'Local',
      minWidth: 130,
      format: (value, row) => {
        const connection = row as ActiveConnection;
        return (
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
            {connection.localAddress}:{String(value)}
          </Typography>
        );
      },
    },
    {
      id: 'remotePort',
      label: 'Remote',
      minWidth: 160,
      format: (value, row) => {
        const connection = row as ActiveConnection;
        return (
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
            {connection.remoteAddress}:{String(value)}
          </Typography>
        );
      },
    },
    {
      id: 'state',
      label: 'State',
      minWidth: 120,
      format: (value) => (
        <Chip
          label={String(value)}
          size="small"
          color={getStateColor(String(value)) as 'success' | 'info' | 'warning' | 'error' | 'default'}
        />
      ),
    },
    {
      id: 'process',
      label: 'Process',
      minWidth: 120,
      mobileShow: false,
      format: (value, row) => {
        const connection = row as ActiveConnection;
        return (
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {String(value)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              PID: {connection.pid}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Network & Ports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor network interfaces, active connections, and listening ports
        </Typography>
      </Box>

      {/* Network Overview Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {interfaces.filter((i) => i.name !== 'lo').slice(0, 2).map((iface) => (
          <Grid key={iface.name} size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Router color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      {iface.name}
                    </Typography>
                  </Box>
                  <Chip
                    label={iface.status.toUpperCase()}
                    size="small"
                    color={iface.status === 'up' ? 'success' : 'error'}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  IP: <strong>{iface.ipAddress}</strong>
                </Typography>
                <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Download
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {iface.rxSpeed.toFixed(1)} MB/s
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total: {formatBytes(iface.rxBytes)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Upload
                    </Typography>
                    <Typography variant="h6" color="secondary.main">
                      {iface.txSpeed.toFixed(1)} MB/s
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total: {formatBytes(iface.txBytes)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }} variant="outlined">
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`Interfaces (${interfaces.length})`} />
          <Tab label={`Listening Ports (${ports.length})`} />
          <Tab label={`Active Connections (${connections.length})`} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <DataTable
          columns={interfaceColumns}
          data={interfaces}
          loading={loading}
          searchPlaceholder="Search interfaces..."
          onRefresh={handleRefresh}
          getRowId={(row) => row.name}
          emptyMessage="No network interfaces found"
        />
      )}

      {tabValue === 1 && (
        <DataTable
          columns={portColumns}
          data={ports}
          loading={loading}
          searchPlaceholder="Search by port, service, or process..."
          onRefresh={handleRefresh}
          getRowId={(row) => `${row.port}-${row.protocol}`}
          emptyMessage="No listening ports"
        />
      )}

      {tabValue === 2 && (
        <DataTable
          columns={connectionColumns}
          data={connections}
          loading={loading}
          searchPlaceholder="Search connections..."
          onRefresh={handleRefresh}
          getRowId={(row) => row.id}
          emptyMessage="No active connections"
        />
      )}
    </Box>
  );
}
