'use client';

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Refresh,
} from '@mui/icons-material';
import { StatusBadge } from '@/components/common';
import { useServicesStore, Service } from '@/store';
import { formatUptime } from '@/lib/utils';

export default function ServicesStatus() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { services, updateService } = useServicesStore();

  const handleServiceAction = (service: Service, action: 'start' | 'stop' | 'restart') => {
    // Mock service action
    switch (action) {
      case 'start':
        updateService(service.id, { status: 'running' });
        break;
      case 'stop':
        updateService(service.id, { status: 'stopped' });
        break;
      case 'restart':
        updateService(service.id, { status: 'restarting' });
        setTimeout(() => {
          updateService(service.id, { status: 'running' });
        }, 2000);
        break;
    }
  };

  // Mobile card view
  if (isMobile) {
    return (
      <Box>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Services
        </Typography>
        <Stack spacing={2}>
          {services.map((service) => (
            <Card key={service.id} variant="outlined">
              <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {service.name}
                    </Typography>
                    {service.port && (
                      <Typography variant="caption" color="text.secondary">
                        Port: {service.port}
                      </Typography>
                    )}
                  </Box>
                  <StatusBadge status={service.status} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {service.cpu !== undefined && (
                      <Typography variant="body2" color="text.secondary">
                        CPU: {service.cpu}%
                      </Typography>
                    )}
                    {service.memory !== undefined && (
                      <Typography variant="body2" color="text.secondary">
                        RAM: {service.memory} MB
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    {service.status === 'stopped' ? (
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleServiceAction(service, 'start')}
                      >
                        <PlayArrow />
                      </IconButton>
                    ) : (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => handleServiceAction(service, 'restart')}
                        >
                          <Refresh />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleServiceAction(service, 'stop')}
                        >
                          <Stop />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }

  // Desktop table view
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Services
      </Typography>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 2 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Port</TableCell>
              <TableCell>CPU</TableCell>
              <TableCell>Memory</TableCell>
              <TableCell>Uptime</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {service.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusBadge status={service.status} />
                </TableCell>
                <TableCell>{service.port || '—'}</TableCell>
                <TableCell>{service.cpu !== undefined ? `${service.cpu}%` : '—'}</TableCell>
                <TableCell>{service.memory !== undefined ? `${service.memory} MB` : '—'}</TableCell>
                <TableCell>
                  {service.uptime ? formatUptime(service.uptime) : '—'}
                </TableCell>
                <TableCell align="right">
                  {service.status === 'stopped' ? (
                    <Tooltip title="Start">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleServiceAction(service, 'start')}
                      >
                        <PlayArrow />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip title="Restart">
                        <IconButton
                          size="small"
                          onClick={() => handleServiceAction(service, 'restart')}
                        >
                          <Refresh />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Stop">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleServiceAction(service, 'stop')}
                        >
                          <Stop />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
