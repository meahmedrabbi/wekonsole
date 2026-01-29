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
  Avatar,
  CircularProgress,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import {
  PersonAdd,
  Edit,
  Delete,
  Key,
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  Person,
  SupervisorAccount,
} from '@mui/icons-material';
import { DataTable, Column, ConfirmDialog } from '@/components/ui';
import { useToast } from '@/components/providers';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  shell: string;
  homeDir: string;
}

// Validation schemas
const userSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username must be less than 32 characters')
    .regex(/^[a-z_][a-z0-9_-]*$/, 'Username must start with a lowercase letter or underscore and contain only lowercase letters, numbers, underscores, and hyphens'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'user', 'viewer']),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  shell: z.string().min(1, 'Shell is required'),
});

const editUserSchema = userSchema.omit({ password: true }).extend({
  password: z.string().optional(),
});

const passwordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type UserForm = z.infer<typeof userSchema>;
type EditUserForm = z.infer<typeof editUserSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

// Mock users data
const mockUsers: User[] = [
  { id: '1', username: 'root', email: 'root@wekonsole.local', role: 'admin', status: 'active', lastLogin: '2024-01-20 15:30:00', createdAt: '2024-01-01', shell: '/bin/bash', homeDir: '/root' },
  { id: '2', username: 'admin', email: 'admin@wekonsole.local', role: 'admin', status: 'active', lastLogin: '2024-01-20 14:00:00', createdAt: '2024-01-05', shell: '/bin/bash', homeDir: '/home/admin' },
  { id: '3', username: 'deploy', email: 'deploy@wekonsole.local', role: 'user', status: 'active', lastLogin: '2024-01-20 10:00:00', createdAt: '2024-01-10', shell: '/bin/bash', homeDir: '/home/deploy' },
  { id: '4', username: 'www-data', email: 'www-data@wekonsole.local', role: 'user', status: 'active', lastLogin: 'Never', createdAt: '2024-01-01', shell: '/usr/sbin/nologin', homeDir: '/var/www' },
  { id: '5', username: 'mysql', email: 'mysql@wekonsole.local', role: 'user', status: 'active', lastLogin: 'Never', createdAt: '2024-01-01', shell: '/bin/false', homeDir: '/var/lib/mysql' },
  { id: '6', username: 'viewer', email: 'viewer@example.com', role: 'viewer', status: 'inactive', lastLogin: '2024-01-15 09:00:00', createdAt: '2024-01-12', shell: '/bin/bash', homeDir: '/home/viewer' },
];

const shells = ['/bin/bash', '/bin/sh', '/bin/zsh', '/usr/sbin/nologin', '/bin/false'];

export default function UsersPage() {
  const { showSuccess, showError, showInfo } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const createForm = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: { username: '', email: '', role: 'user', password: '', shell: '/bin/bash' },
  });

  const editForm = useForm<EditUserForm>({
    resolver: zodResolver(editUserSchema),
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setUsers(mockUsers);
    } catch {
      showError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (data: UserForm) => {
    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newUser: User = {
        id: Date.now().toString(),
        username: data.username,
        email: data.email,
        role: data.role,
        status: 'active',
        lastLogin: 'Never',
        createdAt: new Date().toISOString().split('T')[0],
        shell: data.shell,
        homeDir: `/home/${data.username}`,
      };
      setUsers((prev) => [...prev, newUser]);
      showSuccess(`User "${data.username}" created successfully`);
      setCreateDialogOpen(false);
      createForm.reset();
    } catch {
      showError('Failed to create user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditUser = async (data: EditUserForm) => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? { ...u, username: data.username, email: data.email, role: data.role, shell: data.shell }
            : u
        )
      );
      showSuccess(`User "${data.username}" updated successfully`);
      setEditDialogOpen(false);
    } catch {
      showError('Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      showSuccess(`User "${selectedUser.username}" deleted`);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch {
      showError('Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangePassword = async (data: PasswordForm) => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccess(`Password changed for "${selectedUser.username}"`);
      setPasswordDialogOpen(false);
      passwordForm.reset();
    } catch {
      showError('Failed to change password');
    } finally {
      setActionLoading(false);
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    editForm.reset({
      username: user.username,
      email: user.email,
      role: user.role,
      shell: user.shell,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const openPasswordDialog = (user: User) => {
    setSelectedUser(user);
    passwordForm.reset();
    setPasswordDialogOpen(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <AdminPanelSettings fontSize="small" />;
      case 'user':
        return <Person fontSize="small" />;
      case 'viewer':
        return <SupervisorAccount fontSize="small" />;
      default:
        return <Person fontSize="small" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'user':
        return 'primary';
      case 'viewer':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns: Column<User>[] = [
    {
      id: 'username',
      label: 'User',
      minWidth: 150,
      sortable: true,
      format: (_, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
            {row.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {row.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'role',
      label: 'Role',
      minWidth: 100,
      format: (value) => (
        <Chip
          icon={getRoleIcon(String(value))}
          label={String(value)}
          size="small"
          color={getRoleColor(String(value)) as 'error' | 'primary' | 'default'}
          sx={{ textTransform: 'capitalize' }}
        />
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
          color={getStatusColor(String(value)) as 'success' | 'warning' | 'error' | 'default'}
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      id: 'shell',
      label: 'Shell',
      minWidth: 120,
      mobileShow: false,
      format: (value) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
          {String(value)}
        </Typography>
      ),
    },
    {
      id: 'lastLogin',
      label: 'Last Login',
      minWidth: 150,
      sortable: true,
      mobileShow: false,
    },
  ];

  const renderActions = (row: User) => (
    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
      <Tooltip title="Change Password">
        <IconButton size="small" onClick={() => openPasswordDialog(row)}>
          <Key fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton size="small" onClick={() => openEditDialog(row)}>
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          size="small"
          color="error"
          onClick={() => openDeleteDialog(row)}
          disabled={row.username === 'root'}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage system users, roles, and permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add User
        </Button>
      </Box>

      {/* Users Table */}
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        title={`${users.length} Users`}
        searchPlaceholder="Search users..."
        onRefresh={fetchUsers}
        getRowId={(row) => row.id}
        actions={renderActions}
        emptyMessage="No users found"
        stickyFirstColumn
      />

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={createForm.handleSubmit(handleCreateUser)}>
          <DialogTitle>Create New User</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                fullWidth
                label="Username"
                {...createForm.register('username')}
                error={!!createForm.formState.errors.username}
                helperText={createForm.formState.errors.username?.message}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...createForm.register('email')}
                error={!!createForm.formState.errors.email}
                helperText={createForm.formState.errors.email?.message}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...createForm.register('password')}
                error={!!createForm.formState.errors.password}
                helperText={createForm.formState.errors.password?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }}
              />
              <Controller
                name="role"
                control={createForm.control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!createForm.formState.errors.role}>
                    <InputLabel>Role</InputLabel>
                    <Select {...field} label="Role">
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="viewer">Viewer</MenuItem>
                    </Select>
                    {createForm.formState.errors.role && (
                      <FormHelperText>{createForm.formState.errors.role.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="shell"
                control={createForm.control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Shell</InputLabel>
                    <Select {...field} label="Shell">
                      {shells.map((shell) => (
                        <MenuItem key={shell} value={shell}>
                          {shell}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={16} /> : undefined}
            >
              Create User
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={editForm.handleSubmit(handleEditUser)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                fullWidth
                label="Username"
                {...editForm.register('username')}
                error={!!editForm.formState.errors.username}
                helperText={editForm.formState.errors.username?.message}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...editForm.register('email')}
                error={!!editForm.formState.errors.email}
                helperText={editForm.formState.errors.email?.message}
              />
              <Controller
                name="role"
                control={editForm.control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select {...field} label="Role">
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="viewer">Viewer</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="shell"
                control={editForm.control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Shell</InputLabel>
                    <Select {...field} label="Shell">
                      {shells.map((shell) => (
                        <MenuItem key={shell} value={shell}>
                          {shell}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={16} /> : undefined}
            >
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={passwordForm.handleSubmit(handleChangePassword)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Changing password for: <strong>{selectedUser?.username}</strong>
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                {...passwordForm.register('newPassword')}
                error={!!passwordForm.formState.errors.newPassword}
                helperText={passwordForm.formState.errors.newPassword?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                {...passwordForm.register('confirmPassword')}
                error={!!passwordForm.formState.errors.confirmPassword}
                helperText={passwordForm.formState.errors.confirmPassword?.message}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordDialogOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={16} /> : undefined}
            >
              Change Password
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete user "${selectedUser?.username}"? This action cannot be undone and will remove all associated data.`}
        confirmText="Delete User"
        variant="error"
        loading={actionLoading}
      />
    </Box>
  );
}
