'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
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
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import {
  Add,
  Delete,
  Security,
  Shield,
  Block,
  CheckCircle,
  VpnLock,
} from '@mui/icons-material';
import { DataTable, Column, ConfirmDialog } from '@/components/ui';
import { useToast } from '@/components/providers';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface FirewallRule {
  id: string;
  action: 'allow' | 'deny';
  direction: 'in' | 'out';
  protocol: 'tcp' | 'udp' | 'any';
  port: string;
  source: string;
  destination: string;
  description: string;
  enabled: boolean;
}

interface SecurityStatus {
  ufwEnabled: boolean;
  defaultIncoming: 'allow' | 'deny';
  defaultOutgoing: 'allow' | 'deny';
  activeRules: number;
  blockedAttempts: number;
}

// Validation schema
const ruleSchema = z.object({
  action: z.enum(['allow', 'deny']),
  direction: z.enum(['in', 'out']),
  protocol: z.enum(['tcp', 'udp', 'any']),
  port: z
    .string()
    .min(1, 'Port is required')
    .regex(/^(\d+|\d+:\d+|any)$/, 'Invalid port format (e.g., 80, 8080:8090, or any)'),
  source: z.string().min(1, 'Source is required'),
  destination: z.string().optional(),
  description: z.string().max(100, 'Description must be less than 100 characters').optional(),
});

type RuleForm = z.infer<typeof ruleSchema>;

// Mock data
const mockRules: FirewallRule[] = [
  { id: '1', action: 'allow', direction: 'in', protocol: 'tcp', port: '22', source: 'any', destination: 'any', description: 'SSH access', enabled: true },
  { id: '2', action: 'allow', direction: 'in', protocol: 'tcp', port: '80', source: 'any', destination: 'any', description: 'HTTP web server', enabled: true },
  { id: '3', action: 'allow', direction: 'in', protocol: 'tcp', port: '443', source: 'any', destination: 'any', description: 'HTTPS web server', enabled: true },
  { id: '4', action: 'allow', direction: 'in', protocol: 'tcp', port: '3306', source: '10.0.0.0/8', destination: 'any', description: 'MySQL from internal network', enabled: true },
  { id: '5', action: 'deny', direction: 'in', protocol: 'any', port: '23', source: 'any', destination: 'any', description: 'Block Telnet', enabled: true },
  { id: '6', action: 'allow', direction: 'out', protocol: 'any', port: 'any', source: 'any', destination: 'any', description: 'Allow all outgoing', enabled: true },
];

const mockStatus: SecurityStatus = {
  ufwEnabled: true,
  defaultIncoming: 'deny',
  defaultOutgoing: 'allow',
  activeRules: 6,
  blockedAttempts: 1234,
};

export default function SecurityPage() {
  const { showSuccess, showError, showInfo } = useToast();
  
  const [rules, setRules] = useState<FirewallRule[]>([]);
  const [status, setStatus] = useState<SecurityStatus>(mockStatus);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<FirewallRule | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const form = useForm<RuleForm>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      action: 'allow',
      direction: 'in',
      protocol: 'tcp',
      port: '',
      source: 'any',
      destination: 'any',
      description: '',
    },
  });

  const fetchRules = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setRules(mockRules);
      setStatus(mockStatus);
    } catch {
      showError('Failed to fetch firewall rules');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleFirewall = async () => {
    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus((prev) => ({ ...prev, ufwEnabled: !prev.ufwEnabled }));
      showSuccess(status.ufwEnabled ? 'Firewall disabled' : 'Firewall enabled');
    } catch {
      showError('Failed to toggle firewall');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddRule = async (data: RuleForm) => {
    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newRule: FirewallRule = {
        id: Date.now().toString(),
        ...data,
        destination: data.destination || 'any',
        description: data.description || '',
        enabled: true,
      };
      setRules((prev) => [...prev, newRule]);
      setStatus((prev) => ({ ...prev, activeRules: prev.activeRules + 1 }));
      showSuccess('Firewall rule added');
      setAddDialogOpen(false);
      form.reset();
    } catch {
      showError('Failed to add rule');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRule = async () => {
    if (!selectedRule) return;
    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setRules((prev) => prev.filter((r) => r.id !== selectedRule.id));
      setStatus((prev) => ({ ...prev, activeRules: Math.max(0, prev.activeRules - 1) }));
      showSuccess('Firewall rule deleted');
      setDeleteDialogOpen(false);
      setSelectedRule(null);
    } catch {
      showError('Failed to delete rule');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleRule = async (rule: FirewallRule) => {
    try {
      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r))
      );
      showInfo(`Rule ${rule.enabled ? 'disabled' : 'enabled'}`);
    } catch {
      showError('Failed to toggle rule');
    }
  };

  const columns: Column<FirewallRule>[] = [
    {
      id: 'action',
      label: 'Action',
      minWidth: 80,
      format: (value) => (
        <Chip
          icon={value === 'allow' ? <CheckCircle /> : <Block />}
          label={String(value).toUpperCase()}
          size="small"
          color={value === 'allow' ? 'success' : 'error'}
        />
      ),
    },
    {
      id: 'direction',
      label: 'Direction',
      minWidth: 80,
      format: (value) => (
        <Chip
          label={value === 'in' ? 'Incoming' : 'Outgoing'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      id: 'protocol',
      label: 'Protocol',
      minWidth: 80,
      format: (value) => (
        <Typography variant="body2" sx={{ textTransform: 'uppercase', fontWeight: 500 }}>
          {String(value)}
        </Typography>
      ),
    },
    {
      id: 'port',
      label: 'Port',
      minWidth: 80,
      format: (value) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {String(value)}
        </Typography>
      ),
    },
    {
      id: 'source',
      label: 'Source',
      minWidth: 120,
      mobileShow: false,
      format: (value) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
          {String(value)}
        </Typography>
      ),
    },
    {
      id: 'description',
      label: 'Description',
      minWidth: 150,
      mobileShow: false,
    },
    {
      id: 'enabled',
      label: 'Status',
      minWidth: 80,
      format: (value, row) => (
        <Switch
          size="small"
          checked={Boolean(value)}
          onChange={() => handleToggleRule(row)}
        />
      ),
    },
  ];

  const renderActions = (row: FirewallRule) => (
    <Tooltip title="Delete Rule">
      <IconButton
        size="small"
        color="error"
        onClick={() => {
          setSelectedRule(row);
          setDeleteDialogOpen(true);
        }}
      >
        <Delete fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Security & Firewall
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage firewall rules and security settings
        </Typography>
      </Box>

      {/* Status Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Firewall Status
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {status.ufwEnabled ? 'Active' : 'Inactive'}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: status.ufwEnabled ? 'success.light' : 'error.light',
                  }}
                >
                  <Shield sx={{ color: status.ufwEnabled ? 'success.dark' : 'error.dark' }} />
                </Box>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={status.ufwEnabled}
                    onChange={handleToggleFirewall}
                    disabled={actionLoading}
                  />
                }
                label={status.ufwEnabled ? 'Enabled' : 'Disabled'}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Default Incoming
                  </Typography>
                  <Typography variant="h6" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
                    {status.defaultIncoming}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: status.defaultIncoming === 'deny' ? 'success.light' : 'warning.light',
                  }}
                >
                  <VpnLock sx={{ color: status.defaultIncoming === 'deny' ? 'success.dark' : 'warning.dark' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Active Rules
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {status.activeRules}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.light',
                  }}
                >
                  <Security sx={{ color: 'primary.dark' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Blocked Attempts
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {status.blockedAttempts.toLocaleString()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'error.light',
                  }}
                >
                  <Block sx={{ color: 'error.dark' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Warning if firewall is disabled */}
      {!status.ufwEnabled && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Warning:</strong> Firewall is currently disabled. Your server may be vulnerable to attacks.
          </Typography>
        </Alert>
      )}

      {/* Rules Table Header */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600}>
          Firewall Rules
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddDialogOpen(true)}
        >
          Add Rule
        </Button>
      </Box>

      {/* Rules Table */}
      <DataTable
        columns={columns}
        data={rules}
        loading={loading}
        searchPlaceholder="Search rules..."
        onRefresh={fetchRules}
        getRowId={(row) => row.id}
        actions={renderActions}
        emptyMessage="No firewall rules configured"
      />

      {/* Add Rule Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={form.handleSubmit(handleAddRule)}>
          <DialogTitle>Add Firewall Rule</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="action"
                  control={form.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Action</InputLabel>
                      <Select {...field} label="Action">
                        <MenuItem value="allow">Allow</MenuItem>
                        <MenuItem value="deny">Deny</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  name="direction"
                  control={form.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Direction</InputLabel>
                      <Select {...field} label="Direction">
                        <MenuItem value="in">Incoming</MenuItem>
                        <MenuItem value="out">Outgoing</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="protocol"
                  control={form.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Protocol</InputLabel>
                      <Select {...field} label="Protocol">
                        <MenuItem value="tcp">TCP</MenuItem>
                        <MenuItem value="udp">UDP</MenuItem>
                        <MenuItem value="any">Any</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                <TextField
                  fullWidth
                  label="Port"
                  placeholder="80, 8080:8090, or any"
                  {...form.register('port')}
                  error={!!form.formState.errors.port}
                  helperText={form.formState.errors.port?.message}
                />
              </Box>
              <TextField
                fullWidth
                label="Source"
                placeholder="any, 192.168.1.0/24, or specific IP"
                {...form.register('source')}
                error={!!form.formState.errors.source}
                helperText={form.formState.errors.source?.message}
              />
              <TextField
                fullWidth
                label="Description (optional)"
                placeholder="Rule description"
                {...form.register('description')}
                error={!!form.formState.errors.description}
                helperText={form.formState.errors.description?.message}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={16} /> : undefined}
            >
              Add Rule
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteRule}
        title="Delete Firewall Rule"
        message={`Are you sure you want to delete this firewall rule? This may affect your server's security.`}
        confirmText="Delete Rule"
        variant="error"
        loading={actionLoading}
      />
    </Box>
  );
}
