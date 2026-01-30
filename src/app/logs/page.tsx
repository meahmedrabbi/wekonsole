'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  useTheme,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Refresh,
  Search,
  Download,
  PlayArrow,
  Pause,
  Clear,
  Error,
  Warning,
  Info,
  CheckCircle,
} from '@mui/icons-material';
import { useToast } from '@/components/providers';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  source: string;
  message: string;
}

interface LogFile {
  name: string;
  path: string;
  size: number;
  lastModified: string;
}

// Mock log data
const mockLogFiles: LogFile[] = [
  { name: 'syslog', path: '/var/log/syslog', size: 15728640, lastModified: '2024-01-20 15:30:00' },
  { name: 'auth.log', path: '/var/log/auth.log', size: 2097152, lastModified: '2024-01-20 15:25:00' },
  { name: 'nginx/access.log', path: '/var/log/nginx/access.log', size: 52428800, lastModified: '2024-01-20 15:30:00' },
  { name: 'nginx/error.log', path: '/var/log/nginx/error.log', size: 1048576, lastModified: '2024-01-20 14:00:00' },
  { name: 'mysql/error.log', path: '/var/log/mysql/error.log', size: 524288, lastModified: '2024-01-20 10:00:00' },
  { name: 'fail2ban.log', path: '/var/log/fail2ban.log', size: 262144, lastModified: '2024-01-20 15:00:00' },
];

const logMessages = {
  error: [
    'Connection refused: unable to connect to upstream server',
    'Failed password for invalid user admin from 192.168.1.100',
    'Out of memory: Kill process 1234 (node) score 500',
    'Permission denied while accessing /var/www/html',
    'MySQL server has gone away',
  ],
  warning: [
    'High CPU usage detected (85%)',
    'Disk space running low on /dev/sda1 (90% used)',
    'Connection pool exhausted, queuing requests',
    'SSL certificate expires in 7 days',
    'Rate limit exceeded for IP 203.0.113.45',
  ],
  info: [
    'Started nginx web server',
    'Accepted publickey for user deploy from 192.168.1.50',
    'Backup completed successfully',
    'System update available: 12 packages can be upgraded',
    'New connection from 10.0.0.25:45678',
  ],
  debug: [
    'Processing request GET /api/status',
    'Cache hit for key user:1234',
    'Executing query: SELECT * FROM users',
    'Memory usage: 4.2GB / 16GB',
    'Request completed in 45ms',
  ],
};

const generateMockLogs = (): LogEntry[] => {
  const sources = ['nginx', 'sshd', 'systemd', 'kernel', 'mysql', 'cron', 'fail2ban'];

  const logs: LogEntry[] = [];
  const now = new Date();

  for (let i = 0; i < 100; i++) {
    const level = ['error', 'warning', 'info', 'info', 'info', 'debug'][Math.floor(Math.random() * 6)] as LogEntry['level'];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const messageList = logMessages[level];
    const message = messageList[Math.floor(Math.random() * messageList.length)];
    const timestamp = new Date(now.getTime() - i * 30000 - Math.random() * 60000);

    logs.push({
      id: `log-${i}`,
      timestamp: timestamp.toISOString().replace('T', ' ').slice(0, 19),
      level,
      source,
      message,
    });
  }

  return logs;
};

export default function LogsPage() {
  const theme = useTheme();
  const { showSuccess, showError, showInfo } = useToast();
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logFiles] = useState<LogFile[]>(mockLogFiles);
  const [selectedFile, setSelectedFile] = useState('syslog');
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string[]>(['error', 'warning', 'info', 'debug']);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLogs(generateMockLogs());
    } catch {
      showError('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Add a new log entry at the top
      const levels: LogEntry['level'][] = ['error', 'warning', 'info', 'debug'];
      const sources = ['nginx', 'sshd', 'systemd', 'kernel', 'mysql'];
      const level = levels[Math.floor(Math.random() * 4)];
      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        level,
        source: sources[Math.floor(Math.random() * sources.length)],
        message: logMessages[level][Math.floor(Math.random() * 5)],
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleDownload = () => {
    showSuccess('Downloading log file...');
    // In real implementation, this would trigger a file download
  };

  const handleClearLogs = () => {
    setLogs([]);
    showInfo('Log display cleared');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
        return theme.palette.info.main;
      case 'debug':
        return theme.palette.success.main;
      default:
        return theme.palette.text.primary;
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (!levelFilter.includes(log.level)) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        log.message.toLowerCase().includes(query) ||
        log.source.toLowerCase().includes(query) ||
        log.level.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          System Logs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and search system logs in real-time
        </Typography>
      </Box>

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }} variant="outlined">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          {/* Log File Selector */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Log File</InputLabel>
            <Select
              value={selectedFile}
              label="Log File"
              onChange={(e) => setSelectedFile(e.target.value)}
            >
              {logFiles.map((file) => (
                <MenuItem key={file.path} value={file.name}>
                  {file.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Search */}
          <TextField
            size="small"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 250 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }
            }}
          />

          {/* Level Filter */}
          <ToggleButtonGroup
            size="small"
            value={levelFilter}
            onChange={(_, newValue) => {
              if (newValue.length > 0) setLevelFilter(newValue);
            }}
          >
            <ToggleButton value="error" sx={{ color: 'error.main' }}>
              <Tooltip title="Errors">
                <Error fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="warning" sx={{ color: 'warning.main' }}>
              <Tooltip title="Warnings">
                <Warning fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="info" sx={{ color: 'info.main' }}>
              <Tooltip title="Info">
                <Info fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="debug" sx={{ color: 'success.main' }}>
              <Tooltip title="Debug">
                <CheckCircle fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
            <Tooltip title={autoRefresh ? 'Pause auto-refresh' : 'Start auto-refresh'}>
              <Button
                variant={autoRefresh ? 'contained' : 'outlined'}
                size="small"
                startIcon={autoRefresh ? <Pause /> : <PlayArrow />}
                onClick={() => setAutoRefresh(!autoRefresh)}
                color={autoRefresh ? 'success' : 'primary'}
              >
                {autoRefresh ? 'Live' : 'Paused'}
              </Button>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchLogs} disabled={loading}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download">
              <IconButton onClick={handleDownload}>
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear display">
              <IconButton onClick={handleClearLogs}>
                <Clear />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Log Display */}
      <Paper
        ref={logContainerRef}
        variant="outlined"
        sx={{
          p: 0,
          borderRadius: 2,
          bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
          maxHeight: 'calc(100vh - 380px)',
          minHeight: 400,
          overflow: 'auto',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        ) : filteredLogs.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography color="text.secondary">No logs found</Typography>
          </Box>
        ) : (
          <Box component="pre" sx={{ m: 0, p: 2, fontFamily: 'monospace', fontSize: '0.8125rem' }}>
            {filteredLogs.map((log) => (
              <Box
                key={log.id}
                sx={{
                  display: 'flex',
                  gap: 1,
                  py: 0.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    color: 'text.secondary',
                    whiteSpace: 'nowrap',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                  }}
                >
                  {log.timestamp}
                </Typography>
                <Chip
                  size="small"
                  label={log.level.toUpperCase()}
                  sx={{
                    height: 20,
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    bgcolor: `${getLevelColor(log.level)}20`,
                    color: getLevelColor(log.level),
                    borderRadius: 1,
                  }}
                />
                <Typography
                  component="span"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    minWidth: 80,
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                  }}
                >
                  [{log.source}]
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    color: 'text.primary',
                    flex: 1,
                    wordBreak: 'break-word',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                  }}
                >
                  {log.message}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* Status Bar */}
      <Box
        sx={{
          mt: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Showing {filteredLogs.length} of {logs.length} entries
        </Typography>
        {autoRefresh && (
          <Chip
            size="small"
            icon={<PlayArrow sx={{ fontSize: 14 }} />}
            label="Auto-refreshing every 3s"
            color="success"
            variant="outlined"
            sx={{ height: 24 }}
          />
        )}
      </Box>
    </Box>
  );
}
