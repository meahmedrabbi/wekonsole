'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Paper,
  Breadcrumbs,
  Link,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Folder,
  InsertDriveFile,
  CreateNewFolder,
  NoteAdd,
  Upload,
  Download,
  Delete,
  Edit,
  Visibility,
  Home,
  NavigateNext,
  Refresh,
  ArrowBack,
  Lock,
} from '@mui/icons-material';
import { DataTable, Column, ConfirmDialog } from '@/components/ui';
import { useToast } from '@/components/providers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory' | 'symlink';
  size: number;
  permissions: string;
  owner: string;
  group: string;
  modified: string;
}

// Schema for file/folder creation
const createItemSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters')
    .regex(/^[^/\\:*?"<>|]+$/, 'Invalid characters in name'),
});

const renameSchema = z.object({
  newName: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters')
    .regex(/^[^/\\:*?"<>|]+$/, 'Invalid characters in name'),
});

const permissionsSchema = z.object({
  permissions: z
    .string()
    .regex(/^[0-7]{3,4}$/, 'Invalid permissions format (e.g., 755 or 0755)'),
});

type CreateItemForm = z.infer<typeof createItemSchema>;
type RenameForm = z.infer<typeof renameSchema>;
type PermissionsForm = z.infer<typeof permissionsSchema>;

// Mock file system data
const mockFileSystem: Record<string, FileItem[]> = {
  '/': [
    { name: 'home', path: '/home', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-15 10:00:00' },
    { name: 'var', path: '/var', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-15 10:00:00' },
    { name: 'etc', path: '/etc', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-15 10:00:00' },
    { name: 'usr', path: '/usr', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-15 10:00:00' },
    { name: 'tmp', path: '/tmp', type: 'directory', size: 4096, permissions: 'drwxrwxrwt', owner: 'root', group: 'root', modified: '2024-01-20 15:30:00' },
  ],
  '/home': [
    { name: 'deploy', path: '/home/deploy', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'deploy', group: 'deploy', modified: '2024-01-20 14:00:00' },
    { name: 'admin', path: '/home/admin', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'admin', group: 'admin', modified: '2024-01-18 09:00:00' },
  ],
  '/home/deploy': [
    { name: 'app', path: '/home/deploy/app', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'deploy', group: 'deploy', modified: '2024-01-20 14:00:00' },
    { name: '.bashrc', path: '/home/deploy/.bashrc', type: 'file', size: 3526, permissions: '-rw-r--r--', owner: 'deploy', group: 'deploy', modified: '2024-01-15 10:00:00' },
    { name: '.profile', path: '/home/deploy/.profile', type: 'file', size: 807, permissions: '-rw-r--r--', owner: 'deploy', group: 'deploy', modified: '2024-01-15 10:00:00' },
  ],
  '/home/deploy/app': [
    { name: 'server.js', path: '/home/deploy/app/server.js', type: 'file', size: 15420, permissions: '-rw-r--r--', owner: 'deploy', group: 'deploy', modified: '2024-01-20 14:00:00' },
    { name: 'package.json', path: '/home/deploy/app/package.json', type: 'file', size: 1245, permissions: '-rw-r--r--', owner: 'deploy', group: 'deploy', modified: '2024-01-20 14:00:00' },
    { name: 'node_modules', path: '/home/deploy/app/node_modules', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'deploy', group: 'deploy', modified: '2024-01-20 14:00:00' },
    { name: 'public', path: '/home/deploy/app/public', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'deploy', group: 'deploy', modified: '2024-01-20 14:00:00' },
    { name: '.env', path: '/home/deploy/app/.env', type: 'file', size: 256, permissions: '-rw-------', owner: 'deploy', group: 'deploy', modified: '2024-01-20 14:00:00' },
  ],
  '/var': [
    { name: 'www', path: '/var/www', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-15 10:00:00' },
    { name: 'log', path: '/var/log', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'root', group: 'syslog', modified: '2024-01-20 15:00:00' },
    { name: 'lib', path: '/var/lib', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-15 10:00:00' },
  ],
  '/var/www': [
    { name: 'html', path: '/var/www/html', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'www-data', group: 'www-data', modified: '2024-01-15 10:00:00' },
  ],
  '/var/www/html': [
    { name: 'index.html', path: '/var/www/html/index.html', type: 'file', size: 10918, permissions: '-rw-r--r--', owner: 'www-data', group: 'www-data', modified: '2024-01-15 10:00:00' },
    { name: 'styles.css', path: '/var/www/html/styles.css', type: 'file', size: 4521, permissions: '-rw-r--r--', owner: 'www-data', group: 'www-data', modified: '2024-01-15 10:00:00' },
    { name: 'script.js', path: '/var/www/html/script.js', type: 'file', size: 8734, permissions: '-rw-r--r--', owner: 'www-data', group: 'www-data', modified: '2024-01-15 10:00:00' },
    { name: 'images', path: '/var/www/html/images', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'www-data', group: 'www-data', modified: '2024-01-15 10:00:00' },
  ],
  '/etc': [
    { name: 'nginx', path: '/etc/nginx', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-15 10:30:00' },
    { name: 'ssh', path: '/etc/ssh', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-15 10:00:00' },
    { name: 'passwd', path: '/etc/passwd', type: 'file', size: 2458, permissions: '-rw-r--r--', owner: 'root', group: 'root', modified: '2024-01-18 10:00:00' },
    { name: 'shadow', path: '/etc/shadow', type: 'file', size: 1234, permissions: '-rw-r-----', owner: 'root', group: 'shadow', modified: '2024-01-18 10:00:00' },
    { name: 'hosts', path: '/etc/hosts', type: 'file', size: 256, permissions: '-rw-r--r--', owner: 'root', group: 'root', modified: '2024-01-15 10:00:00' },
  ],
};

const mockFileContents: Record<string, string> = {
  '/home/deploy/.bashrc': `# ~/.bashrc: executed by bash(1) for non-login shells.

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# don't put duplicate lines or lines starting with space in the history.
HISTCONTROL=ignoreboth

# append to the history file, don't overwrite it
shopt -s histappend

# for setting history length see HISTSIZE and HISTFILESIZE in bash(1)
HISTSIZE=1000
HISTFILESIZE=2000
`,
  '/var/www/html/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to WeKonsole</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to WeKonsole</h1>
        <p>Your server is running successfully!</p>
    </div>
    <script src="script.js"></script>
</body>
</html>
`,
  '/etc/hosts': `127.0.0.1   localhost
127.0.1.1   wekonsole-server

# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
`,
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function FilesPage() {
  const theme = useTheme();
  const { showSuccess, showError } = useToast();
  
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'directory'>('file');
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);
  
  // Context menu
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const [contextFile, setContextFile] = useState<FileItem | null>(null);

  // Forms
  const createForm = useForm<CreateItemForm>({
    resolver: zodResolver(createItemSchema),
    defaultValues: { name: '' },
  });

  const renameForm = useForm<RenameForm>({
    resolver: zodResolver(renameSchema),
    defaultValues: { newName: '' },
  });

  const permissionsForm = useForm<PermissionsForm>({
    resolver: zodResolver(permissionsSchema),
    defaultValues: { permissions: '' },
  });

  const fetchFiles = useCallback(async (path: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const fileList = mockFileSystem[path] || [];
      setFiles(fileList);
    } catch {
      showError('Failed to load directory');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath, fetchFiles]);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
  };

  const handleDoubleClick = (file: FileItem) => {
    if (file.type === 'directory') {
      navigateTo(file.path);
    } else {
      handleViewFile(file);
    }
  };

  const handleGoBack = () => {
    if (currentPath === '/') return;
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
    navigateTo(parentPath);
  };

  const handleViewFile = async (file: FileItem) => {
    if (file.type !== 'file') return;
    
    setSelectedFile(file);
    const content = mockFileContents[file.path] || `[Binary file or content not available]\n\nFile: ${file.name}\nSize: ${formatFileSize(file.size)}\nPermissions: ${file.permissions}`;
    setFileContent(content);
    setViewDialogOpen(true);
  };

  const handleCreateItem = async (data: CreateItemForm) => {
    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const newPath = `${currentPath === '/' ? '' : currentPath}/${data.name}`;
      const newItem: FileItem = {
        name: data.name,
        path: newPath,
        type: createType,
        size: createType === 'directory' ? 4096 : 0,
        permissions: createType === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--',
        owner: 'deploy',
        group: 'deploy',
        modified: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };
      setFiles((prev) => [...prev, newItem]);
      showSuccess(`${createType === 'directory' ? 'Folder' : 'File'} "${data.name}" created`);
      setCreateDialogOpen(false);
      createForm.reset();
    } catch {
      showError('Failed to create item');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRename = async (data: RenameForm) => {
    if (!selectedFile) return;
    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setFiles((prev) =>
        prev.map((f) =>
          f.path === selectedFile.path
            ? { ...f, name: data.newName, path: `${currentPath === '/' ? '' : currentPath}/${data.newName}` }
            : f
        )
      );
      showSuccess(`Renamed to "${data.newName}"`);
      setRenameDialogOpen(false);
      renameForm.reset();
    } catch {
      showError('Failed to rename');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFile) return;
    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setFiles((prev) => prev.filter((f) => f.path !== selectedFile.path));
      showSuccess(`"${selectedFile.name}" deleted`);
      setDeleteDialogOpen(false);
      setSelectedFile(null);
    } catch {
      showError('Failed to delete');
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangePermissions = async (data: PermissionsForm) => {
    if (!selectedFile) return;
    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const perms = data.permissions.padStart(4, '0');
      showSuccess(`Permissions changed to ${perms}`);
      setPermissionsDialogOpen(false);
      permissionsForm.reset();
    } catch {
      showError('Failed to change permissions');
    } finally {
      setActionLoading(false);
    }
  };

  const handleContextMenu = (event: React.MouseEvent, file: FileItem) => {
    event.preventDefault();
    setContextFile(file);
    setContextMenu({ mouseX: event.clientX - 2, mouseY: event.clientY - 4 });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const openRenameDialog = (file: FileItem) => {
    setSelectedFile(file);
    renameForm.setValue('newName', file.name);
    setRenameDialogOpen(true);
    handleCloseContextMenu();
  };

  const openDeleteDialog = (file: FileItem) => {
    setSelectedFile(file);
    setDeleteDialogOpen(true);
    handleCloseContextMenu();
  };

  const openPermissionsDialog = (file: FileItem) => {
    setSelectedFile(file);
    permissionsForm.setValue('permissions', '755');
    setPermissionsDialogOpen(true);
    handleCloseContextMenu();
  };

  const pathParts = currentPath.split('/').filter(Boolean);

  const columns: Column<FileItem>[] = [
    {
      id: 'name',
      label: 'Name',
      minWidth: 200,
      sortable: true,
      format: (_, row) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            '&:hover': { color: 'primary.main' },
          }}
          onDoubleClick={() => handleDoubleClick(row)}
          onContextMenu={(e) => handleContextMenu(e, row)}
        >
          {row.type === 'directory' ? (
            <Folder color="primary" />
          ) : (
            <InsertDriveFile color="action" />
          )}
          <Typography variant="body2" fontWeight={500}>
            {row.name}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'size',
      label: 'Size',
      minWidth: 100,
      sortable: true,
      mobileShow: false,
      format: (value, row) => (
        <Typography variant="body2">
          {row.type === 'directory' ? '-' : formatFileSize(Number(value))}
        </Typography>
      ),
    },
    {
      id: 'permissions',
      label: 'Permissions',
      minWidth: 120,
      mobileShow: false,
      format: (value) => (
        <Chip
          label={String(value)}
          size="small"
          variant="outlined"
          icon={<Lock sx={{ fontSize: 14 }} />}
          sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
        />
      ),
    },
    {
      id: 'owner',
      label: 'Owner',
      minWidth: 100,
      mobileShow: false,
    },
    {
      id: 'modified',
      label: 'Modified',
      minWidth: 150,
      sortable: true,
      mobileShow: false,
    },
  ];

  const renderActions = (row: FileItem) => (
    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
      {row.type === 'file' && (
        <Tooltip title="View">
          <IconButton size="small" onClick={() => handleViewFile(row)}>
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Rename">
        <IconButton size="small" onClick={() => openRenameDialog(row)}>
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Permissions">
        <IconButton size="small" onClick={() => openPermissionsDialog(row)}>
          <Lock fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton size="small" color="error" onClick={() => openDeleteDialog(row)}>
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          File Manager
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and manage files on your server
        </Typography>
      </Box>

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }} variant="outlined">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Breadcrumb Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={handleGoBack} disabled={currentPath === '/'}>
              <ArrowBack />
            </IconButton>
            <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap' } }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigateTo('/')}
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
                underline="hover"
              >
                <Home fontSize="small" />
                root
              </Link>
              {pathParts.map((part, index) => {
                const path = '/' + pathParts.slice(0, index + 1).join('/');
                const isLast = index === pathParts.length - 1;
                return isLast ? (
                  <Typography key={path} variant="body2" fontWeight={600}>
                    {part}
                  </Typography>
                ) : (
                  <Link
                    key={path}
                    component="button"
                    variant="body2"
                    onClick={() => navigateTo(path)}
                    underline="hover"
                    sx={{ cursor: 'pointer' }}
                  >
                    {part}
                  </Link>
                );
              })}
            </Breadcrumbs>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={<CreateNewFolder />}
              onClick={() => {
                setCreateType('directory');
                setCreateDialogOpen(true);
              }}
            >
              New Folder
            </Button>
            <Button
              size="small"
              startIcon={<NoteAdd />}
              onClick={() => {
                setCreateType('file');
                setCreateDialogOpen(true);
              }}
            >
              New File
            </Button>
            <Button size="small" startIcon={<Upload />} variant="contained">
              Upload
            </Button>
            <IconButton size="small" onClick={() => fetchFiles(currentPath)}>
              <Refresh />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* File Table */}
      <DataTable
        columns={columns}
        data={files}
        loading={loading}
        title={`${files.length} items`}
        searchPlaceholder="Search files..."
        onRefresh={() => fetchFiles(currentPath)}
        getRowId={(row) => row.path}
        actions={renderActions}
        emptyMessage={currentPath === '/' ? 'Root directory is empty' : 'This folder is empty'}
      />

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {contextFile?.type === 'file' && (
          <MenuItem onClick={() => { handleViewFile(contextFile!); handleCloseContextMenu(); }}>
            <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
            <ListItemText>View</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => openRenameDialog(contextFile!)}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openPermissionsDialog(contextFile!)}>
          <ListItemIcon><Lock fontSize="small" /></ListItemIcon>
          <ListItemText>Permissions</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openDeleteDialog(contextFile!)}>
          <ListItemIcon><Delete fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={createForm.handleSubmit(handleCreateItem)}>
          <DialogTitle>
            Create New {createType === 'directory' ? 'Folder' : 'File'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              label="Name"
              margin="normal"
              {...createForm.register('name')}
              error={!!createForm.formState.errors.name}
              helperText={createForm.formState.errors.name?.message}
            />
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
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={renameForm.handleSubmit(handleRename)}>
          <DialogTitle>Rename</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              label="New Name"
              margin="normal"
              {...renameForm.register('newName')}
              error={!!renameForm.formState.errors.newName}
              helperText={renameForm.formState.errors.newName?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRenameDialogOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={16} /> : undefined}
            >
              Rename
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={permissionsDialogOpen} onClose={() => setPermissionsDialogOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={permissionsForm.handleSubmit(handleChangePermissions)}>
          <DialogTitle>Change Permissions</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {selectedFile?.name}
            </Typography>
            <TextField
              autoFocus
              fullWidth
              label="Permissions (e.g., 755)"
              margin="normal"
              placeholder="755"
              {...permissionsForm.register('permissions')}
              error={!!permissionsForm.formState.errors.permissions}
              helperText={permissionsForm.formState.errors.permissions?.message || 'Enter numeric permissions (e.g., 755, 644)'}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPermissionsDialogOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={16} /> : undefined}
            >
              Apply
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Item"
        message={`Are you sure you want to delete "${selectedFile?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="error"
        loading={actionLoading}
      />

      {/* View File Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            {selectedFile?.name}
            <Typography variant="caption" display="block" color="text.secondary">
              {selectedFile?.path}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
              maxHeight: 400,
              overflow: 'auto',
            }}
          >
            <Typography
              component="pre"
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                m: 0,
              }}
            >
              {fileContent}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<Download />}>
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
