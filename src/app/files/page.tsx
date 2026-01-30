'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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
  Divider,
  List,
  ListItem,
  ListItemButton,
  Collapse,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Folder,
  FolderOpen,
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
  ContentCopy,
  ContentCut,
  ContentPaste,
  ExpandMore,
  ChevronRight,
  ViewList,
  GridView,
  Description,
  Image,
  Code,
  Settings,
  MoreVert,
  Close,
  Save,
  DriveFileMove,
  Search,
  Sort,
  FilterList,
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
  extension?: string;
}

interface TreeNode {
  name: string;
  path: string;
  children?: TreeNode[];
  isExpanded?: boolean;
}

interface ClipboardItem {
  items: FileItem[];
  operation: 'copy' | 'cut';
  sourcePath: string;
}

// Validation schemas
const createItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long')
    .regex(/^[^/\\:*?"<>|]+$/, 'Invalid characters'),
});

const renameSchema = z.object({
  newName: z.string().min(1, 'Name is required').max(255, 'Name too long')
    .regex(/^[^/\\:*?"<>|]+$/, 'Invalid characters'),
});

type CreateItemForm = z.infer<typeof createItemSchema>;
type RenameForm = z.infer<typeof renameSchema>;

// Mock file system
const mockFileSystem: Record<string, FileItem[]> = {
  '/': [
    { name: 'home', path: '/home', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-15 10:00' },
    { name: 'var', path: '/var', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-15 10:00' },
    { name: 'etc', path: '/etc', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-15 10:00' },
    { name: 'usr', path: '/usr', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-15 10:00' },
    { name: 'tmp', path: '/tmp', type: 'directory', size: 4096, permissions: 'drwxrwxrwt', owner: 'root', group: 'root', modified: '2024-01-20 15:30' },
  ],
  '/home': [
    { name: 'deploy', path: '/home/deploy', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'deploy', group: 'deploy', modified: '2024-01-20 14:00' },
    { name: 'admin', path: '/home/admin', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'admin', group: 'admin', modified: '2024-01-18 09:00' },
  ],
  '/home/deploy': [
    { name: 'app', path: '/home/deploy/app', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'deploy', group: 'deploy', modified: '2024-01-20 14:00' },
    { name: '.bashrc', path: '/home/deploy/.bashrc', type: 'file', size: 3526, permissions: '-rw-r--r--', owner: 'deploy', group: 'deploy', modified: '2024-01-15 10:00', extension: 'bashrc' },
    { name: '.profile', path: '/home/deploy/.profile', type: 'file', size: 807, permissions: '-rw-r--r--', owner: 'deploy', group: 'deploy', modified: '2024-01-15 10:00', extension: 'profile' },
  ],
  '/home/deploy/app': [
    { name: 'server.js', path: '/home/deploy/app/server.js', type: 'file', size: 15420, permissions: '-rw-r--r--', owner: 'deploy', group: 'deploy', modified: '2024-01-20 14:00', extension: 'js' },
    { name: 'package.json', path: '/home/deploy/app/package.json', type: 'file', size: 1245, permissions: '-rw-r--r--', owner: 'deploy', group: 'deploy', modified: '2024-01-20 14:00', extension: 'json' },
    { name: 'node_modules', path: '/home/deploy/app/node_modules', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'deploy', group: 'deploy', modified: '2024-01-20 14:00' },
    { name: 'public', path: '/home/deploy/app/public', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'deploy', group: 'deploy', modified: '2024-01-20 14:00' },
    { name: '.env', path: '/home/deploy/app/.env', type: 'file', size: 256, permissions: '-rw-------', owner: 'deploy', group: 'deploy', modified: '2024-01-20 14:00', extension: 'env' },
    { name: 'README.md', path: '/home/deploy/app/README.md', type: 'file', size: 2048, permissions: '-rw-r--r--', owner: 'deploy', group: 'deploy', modified: '2024-01-20 14:00', extension: 'md' },
  ],
  '/var': [
    { name: 'www', path: '/var/www', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-15 10:00' },
    { name: 'log', path: '/var/log', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'root', group: 'syslog', modified: '2024-01-20 15:00' },
  ],
  '/var/www': [
    { name: 'html', path: '/var/www/html', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'www-data', group: 'www-data', modified: '2024-01-15 10:00' },
  ],
  '/var/www/html': [
    { name: 'index.html', path: '/var/www/html/index.html', type: 'file', size: 10918, permissions: '-rw-r--r--', owner: 'www-data', group: 'www-data', modified: '2024-01-15 10:00', extension: 'html' },
    { name: 'styles.css', path: '/var/www/html/styles.css', type: 'file', size: 4521, permissions: '-rw-r--r--', owner: 'www-data', group: 'www-data', modified: '2024-01-15 10:00', extension: 'css' },
    { name: 'app.js', path: '/var/www/html/app.js', type: 'file', size: 8734, permissions: '-rw-r--r--', owner: 'www-data', group: 'www-data', modified: '2024-01-15 10:00', extension: 'js' },
    { name: 'logo.png', path: '/var/www/html/logo.png', type: 'file', size: 45000, permissions: '-rw-r--r--', owner: 'www-data', group: 'www-data', modified: '2024-01-15 10:00', extension: 'png' },
  ],
  '/etc': [
    { name: 'nginx', path: '/etc/nginx', type: 'directory', size: 4096, permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-15 10:30' },
    { name: 'passwd', path: '/etc/passwd', type: 'file', size: 2458, permissions: '-rw-r--r--', owner: 'root', group: 'root', modified: '2024-01-18 10:00' },
    { name: 'hosts', path: '/etc/hosts', type: 'file', size: 256, permissions: '-rw-r--r--', owner: 'root', group: 'root', modified: '2024-01-15 10:00' },
  ],
};

const mockFileContents: Record<string, string> = {
  '/home/deploy/.bashrc': `# ~/.bashrc
export PATH="$HOME/.local/bin:$PATH"
alias ll='ls -la'
alias gs='git status'`,
  '/var/www/html/index.html': `<!DOCTYPE html>
<html>
<head><title>Welcome</title></head>
<body><h1>Welcome to WeKonsole</h1></body>
</html>`,
  '/home/deploy/app/server.js': `const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello!'));
app.listen(3000);`,
  '/etc/hosts': `127.0.0.1   localhost
127.0.1.1   wekonsole-server`,
};

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

const getFileIcon = (file: FileItem) => {
  if (file.type === 'directory') return <Folder color="primary" />;
  const ext = file.extension?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) return <Image color="secondary" />;
  if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'go', 'rs'].includes(ext || '')) return <Code color="info" />;
  if (['html', 'css', 'json', 'xml', 'yaml', 'yml', 'md'].includes(ext || '')) return <Description color="warning" />;
  return <InsertDriveFile color="action" />;
};

// Directory Tree Component
function DirectoryTree({ 
  currentPath, 
  onNavigate 
}: { 
  currentPath: string; 
  onNavigate: (path: string) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['/']));

  const toggleExpand = (path: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpanded(newExpanded);
  };

  const renderTree = (path: string, level: number = 0) => {
    const items = mockFileSystem[path]?.filter(f => f.type === 'directory') || [];
    const isExpanded = expanded.has(path);
    const pathName = path === '/' ? 'Root' : path.split('/').pop();
    const isSelected = currentPath === path;

    return (
      <Box key={path}>
        <ListItemButton
          onClick={() => onNavigate(path)}
          selected={isSelected}
          sx={{ pl: level * 2 + 1, py: 0.5, minHeight: 32 }}
        >
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); toggleExpand(path); }}
            sx={{ mr: 0.5, p: 0.25 }}
          >
            {items.length > 0 ? (isExpanded ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />) : <Box sx={{ width: 20 }} />}
          </IconButton>
          {isExpanded ? <FolderOpen fontSize="small" color="primary" sx={{ mr: 1 }} /> : <Folder fontSize="small" color="primary" sx={{ mr: 1 }} />}
          <Typography variant="body2" noWrap sx={{ fontWeight: isSelected ? 600 : 400 }}>
            {pathName}
          </Typography>
        </ListItemButton>
        <Collapse in={isExpanded}>
          {items.map(item => renderTree(item.path, level + 1))}
        </Collapse>
      </Box>
    );
  };

  return (
    <List dense sx={{ py: 0 }}>
      {renderTree('/')}
    </List>
  );
}

export default function FilesPage() {
  const theme = useTheme();
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [clipboard, setClipboard] = useState<ClipboardItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'modified'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'directory'>('file');
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [editorDialogOpen, setEditorDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  
  // Permissions state
  const [permissions, setPermissions] = useState({
    ownerRead: true, ownerWrite: true, ownerExecute: false,
    groupRead: true, groupWrite: false, groupExecute: false,
    otherRead: true, otherWrite: false, otherExecute: false,
  });

  // Context menu
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
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

  // Fetch files
  const fetchFiles = useCallback(async (path: string) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 300));
      const fileList = mockFileSystem[path] || [];
      setFiles(fileList);
      setSelectedFiles(new Set());
    } catch {
      showError('Failed to load directory');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath, fetchFiles]);

  // Navigation
  const navigateTo = (path: string) => {
    setCurrentPath(path);
    setSearchQuery('');
  };

  const handleGoBack = () => {
    if (currentPath === '/') return;
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
    navigateTo(parentPath);
  };

  const handleDoubleClick = (file: FileItem) => {
    if (file.type === 'directory') {
      navigateTo(file.path);
    } else {
      openPreview(file);
    }
  };

  // File operations
  const openPreview = (file: FileItem) => {
    setSelectedFile(file);
    const content = mockFileContents[file.path] || `[File content preview]\n\nFile: ${file.name}\nSize: ${formatSize(file.size)}`;
    setFileContent(content);
    setPreviewDialogOpen(true);
  };

  const openEditor = (file: FileItem) => {
    setSelectedFile(file);
    const content = mockFileContents[file.path] || '';
    setFileContent(content);
    setEditedContent(content);
    setEditorDialogOpen(true);
  };

  const handleSaveFile = async () => {
    setActionLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      showSuccess('File saved successfully');
      setEditorDialogOpen(false);
    } catch {
      showError('Failed to save file');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreate = async (data: CreateItemForm) => {
    setActionLoading(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      const newPath = `${currentPath === '/' ? '' : currentPath}/${data.name}`;
      const newItem: FileItem = {
        name: data.name,
        path: newPath,
        type: createType,
        size: createType === 'directory' ? 4096 : 0,
        permissions: createType === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--',
        owner: 'deploy',
        group: 'deploy',
        modified: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      setFiles(prev => [...prev, newItem]);
      showSuccess(`${createType === 'directory' ? 'Folder' : 'File'} created`);
      setCreateDialogOpen(false);
      createForm.reset();
    } catch {
      showError('Failed to create');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRename = async (data: RenameForm) => {
    if (!selectedFile) return;
    setActionLoading(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      setFiles(prev => prev.map(f => 
        f.path === selectedFile.path 
          ? { ...f, name: data.newName, path: `${currentPath === '/' ? '' : currentPath}/${data.newName}` }
          : f
      ));
      showSuccess('Renamed successfully');
      setRenameDialogOpen(false);
      renameForm.reset();
    } catch {
      showError('Failed to rename');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const toDelete = selectedFile ? [selectedFile] : Array.from(selectedFiles).map(p => files.find(f => f.path === p)!);
    setActionLoading(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      const paths = toDelete.map(f => f.path);
      setFiles(prev => prev.filter(f => !paths.includes(f.path)));
      setSelectedFiles(new Set());
      showSuccess(`Deleted ${toDelete.length} item(s)`);
      setDeleteDialogOpen(false);
      setSelectedFile(null);
    } catch {
      showError('Failed to delete');
    } finally {
      setActionLoading(false);
    }
  };

  // Clipboard operations
  const handleCopy = () => {
    const items = Array.from(selectedFiles).map(p => files.find(f => f.path === p)!).filter(Boolean);
    if (items.length === 0 && contextFile) items.push(contextFile);
    setClipboard({ items, operation: 'copy', sourcePath: currentPath });
    showInfo(`Copied ${items.length} item(s)`);
    setContextMenu(null);
  };

  const handleCut = () => {
    const items = Array.from(selectedFiles).map(p => files.find(f => f.path === p)!).filter(Boolean);
    if (items.length === 0 && contextFile) items.push(contextFile);
    setClipboard({ items, operation: 'cut', sourcePath: currentPath });
    showInfo(`Cut ${items.length} item(s)`);
    setContextMenu(null);
  };

  const handlePaste = async () => {
    if (!clipboard) return;
    setActionLoading(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      const newFiles = clipboard.items.map(item => ({
        ...item,
        path: `${currentPath === '/' ? '' : currentPath}/${item.name}`,
      }));
      setFiles(prev => [...prev, ...newFiles]);
      if (clipboard.operation === 'cut') setClipboard(null);
      showSuccess(`Pasted ${clipboard.items.length} item(s)`);
    } catch {
      showError('Failed to paste');
    } finally {
      setActionLoading(false);
    }
  };

  // Upload
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles?.length) return;

    setUploadProgress(0);
    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        await new Promise(r => setTimeout(r, 500));
        setUploadProgress(((i + 1) / uploadedFiles.length) * 100);
        const file = uploadedFiles[i];
        const newItem: FileItem = {
          name: file.name,
          path: `${currentPath === '/' ? '' : currentPath}/${file.name}`,
          type: 'file',
          size: file.size,
          permissions: '-rw-r--r--',
          owner: 'deploy',
          group: 'deploy',
          modified: new Date().toISOString().slice(0, 16).replace('T', ' '),
          extension: file.name.split('.').pop(),
        };
        setFiles(prev => [...prev, newItem]);
      }
      showSuccess(`Uploaded ${uploadedFiles.length} file(s)`);
    } catch {
      showError('Upload failed');
    } finally {
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Permissions
  const openPermissionsDialog = (file: FileItem) => {
    setSelectedFile(file);
    // Parse permissions string
    const p = file.permissions;
    setPermissions({
      ownerRead: p[1] === 'r', ownerWrite: p[2] === 'w', ownerExecute: p[3] === 'x',
      groupRead: p[4] === 'r', groupWrite: p[5] === 'w', groupExecute: p[6] === 'x',
      otherRead: p[7] === 'r', otherWrite: p[8] === 'w', otherExecute: p[9] === 'x',
    });
    setPermissionsDialogOpen(true);
  };

  const getNumericPermissions = () => {
    const owner = (permissions.ownerRead ? 4 : 0) + (permissions.ownerWrite ? 2 : 0) + (permissions.ownerExecute ? 1 : 0);
    const group = (permissions.groupRead ? 4 : 0) + (permissions.groupWrite ? 2 : 0) + (permissions.groupExecute ? 1 : 0);
    const other = (permissions.otherRead ? 4 : 0) + (permissions.otherWrite ? 2 : 0) + (permissions.otherExecute ? 1 : 0);
    return `${owner}${group}${other}`;
  };

  const handleSavePermissions = async () => {
    setActionLoading(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      showSuccess(`Permissions changed to ${getNumericPermissions()}`);
      setPermissionsDialogOpen(false);
    } catch {
      showError('Failed to change permissions');
    } finally {
      setActionLoading(false);
    }
  };

  // Context menu
  const handleContextMenu = (e: React.MouseEvent, file: FileItem) => {
    e.preventDefault();
    setContextFile(file);
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  // Selection
  const toggleSelection = (path: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(path)) {
      newSelection.delete(path);
    } else {
      newSelection.add(path);
    }
    setSelectedFiles(newSelection);
  };

  const selectAll = () => {
    setSelectedFiles(new Set(files.map(f => f.path)));
  };

  // Filtering and sorting
  const filteredFiles = files
    .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      // Directories first
      if (a.type === 'directory' && b.type !== 'directory') return -1;
      if (a.type !== 'directory' && b.type === 'directory') return 1;
      
      let cmp = 0;
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortBy === 'size') cmp = a.size - b.size;
      else if (sortBy === 'modified') cmp = a.modified.localeCompare(b.modified);
      return sortOrder === 'asc' ? cmp : -cmp;
    });

  const pathParts = currentPath.split('/').filter(Boolean);

  // Table columns
  const columns: Column<FileItem>[] = [
    {
      id: 'name',
      label: 'Name',
      minWidth: 200,
      sortable: true,
      format: (_, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
          onDoubleClick={() => handleDoubleClick(row)}
          onContextMenu={(e) => handleContextMenu(e, row)}>
          <Checkbox
            size="small"
            checked={selectedFiles.has(row.path)}
            onChange={() => toggleSelection(row.path)}
            onClick={(e) => e.stopPropagation()}
          />
          {getFileIcon(row)}
          <Typography variant="body2" fontWeight={500}>{row.name}</Typography>
        </Box>
      ),
    },
    { id: 'size', label: 'Size', minWidth: 80, mobileShow: false, format: (v, r) => r.type === 'directory' ? '-' : formatSize(Number(v)) },
    { id: 'permissions', label: 'Permissions', minWidth: 100, mobileShow: false, format: (v) => <Chip label={String(v)} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }} /> },
    { id: 'owner', label: 'Owner', minWidth: 80, mobileShow: false },
    { id: 'modified', label: 'Modified', minWidth: 120, mobileShow: false },
  ];

  const renderActions = (row: FileItem) => (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {row.type === 'file' && (
        <>
          <Tooltip title="View"><IconButton size="small" onClick={() => openPreview(row)}><Visibility fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => openEditor(row)}><Edit fontSize="small" /></IconButton></Tooltip>
        </>
      )}
      <Tooltip title="Rename"><IconButton size="small" onClick={() => { setSelectedFile(row); renameForm.setValue('newName', row.name); setRenameDialogOpen(true); }}><DriveFileMove fontSize="small" /></IconButton></Tooltip>
      <Tooltip title="Permissions"><IconButton size="small" onClick={() => openPermissionsDialog(row)}><Lock fontSize="small" /></IconButton></Tooltip>
      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => { setSelectedFile(row); setDeleteDialogOpen(true); }}><Delete fontSize="small" /></IconButton></Tooltip>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={700}>File Manager</Typography>
        <Typography variant="body2" color="text.secondary">Browse and manage server files</Typography>
      </Box>

      {/* Upload progress */}
      {uploadProgress !== null && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">Uploading...</Typography>
            <LinearProgress variant="determinate" value={uploadProgress} sx={{ flex: 1 }} />
            <Typography variant="body2">{Math.round(uploadProgress)}%</Typography>
          </Box>
        </Alert>
      )}

      <Box sx={{ display: 'flex', flex: 1, gap: 2, minHeight: 0 }}>
        {/* Sidebar - Directory Tree */}
        <Paper variant="outlined" sx={{ width: 240, flexShrink: 0, overflow: 'auto', display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" fontWeight={600}>Directories</Typography>
          </Box>
          <DirectoryTree currentPath={currentPath} onNavigate={navigateTo} />
        </Paper>

        {/* Main Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Toolbar */}
          <Paper variant="outlined" sx={{ p: 1.5, mb: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              {/* Navigation */}
              <IconButton size="small" onClick={handleGoBack} disabled={currentPath === '/'}><ArrowBack /></IconButton>
              <IconButton size="small" onClick={() => navigateTo('/')}><Home /></IconButton>
              <IconButton size="small" onClick={() => fetchFiles(currentPath)}><Refresh /></IconButton>
              
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              {/* Breadcrumbs */}
              <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ flex: 1 }}>
                <Link component="button" variant="body2" onClick={() => navigateTo('/')} underline="hover">/</Link>
                {pathParts.map((part, i) => {
                  const path = '/' + pathParts.slice(0, i + 1).join('/');
                  return i === pathParts.length - 1 ? (
                    <Typography key={path} variant="body2" fontWeight={600}>{part}</Typography>
                  ) : (
                    <Link key={path} component="button" variant="body2" onClick={() => navigateTo(path)} underline="hover">{part}</Link>
                  );
                })}
              </Breadcrumbs>

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              {/* Search */}
              <TextField
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: 180 }}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> } }}
              />

              {/* View toggle */}
              <ToggleButtonGroup size="small" value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)}>
                <ToggleButton value="list"><ViewList fontSize="small" /></ToggleButton>
                <ToggleButton value="grid"><GridView fontSize="small" /></ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
              <Button size="small" startIcon={<CreateNewFolder />} onClick={() => { setCreateType('directory'); setCreateDialogOpen(true); }}>New Folder</Button>
              <Button size="small" startIcon={<NoteAdd />} onClick={() => { setCreateType('file'); setCreateDialogOpen(true); }}>New File</Button>
              <Button size="small" startIcon={<Upload />} variant="contained" onClick={() => fileInputRef.current?.click()}>Upload</Button>
              <input ref={fileInputRef} type="file" multiple hidden onChange={handleUpload} />
              
              <Divider orientation="vertical" flexItem />
              
              <Button size="small" startIcon={<ContentCopy />} disabled={selectedFiles.size === 0} onClick={handleCopy}>Copy</Button>
              <Button size="small" startIcon={<ContentCut />} disabled={selectedFiles.size === 0} onClick={handleCut}>Cut</Button>
              <Button size="small" startIcon={<ContentPaste />} disabled={!clipboard} onClick={handlePaste}>Paste {clipboard && `(${clipboard.items.length})`}</Button>
              <Button size="small" startIcon={<Delete />} color="error" disabled={selectedFiles.size === 0} onClick={() => { setSelectedFile(null); setDeleteDialogOpen(true); }}>Delete</Button>
            </Box>
          </Paper>

          {/* File List */}
          <Paper variant="outlined" sx={{ flex: 1, overflow: 'auto' }}>
            {viewMode === 'list' ? (
              <DataTable
                columns={columns}
                data={filteredFiles}
                loading={loading}
                getRowId={(row) => row.path}
                actions={renderActions}
                emptyMessage="This folder is empty"
                rowsPerPageOptions={[25, 50, 100]}
              />
            ) : (
              <Box sx={{ p: 2 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                ) : filteredFiles.length === 0 ? (
                  <Typography color="text.secondary" textAlign="center" py={4}>This folder is empty</Typography>
                ) : (
                  <Grid container spacing={1.5}>
                    {filteredFiles.map((file) => (
                      <Grid key={file.path} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                        <Card 
                          variant="outlined" 
                          sx={{ 
                            bgcolor: selectedFiles.has(file.path) ? 'action.selected' : 'transparent',
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        >
                          <CardActionArea
                            onDoubleClick={() => handleDoubleClick(file)}
                            onClick={() => toggleSelection(file.path)}
                            onContextMenu={(e) => handleContextMenu(e, file)}
                            sx={{ p: 1.5 }}
                          >
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ fontSize: 40 }}>{getFileIcon(file)}</Box>
                              <Typography variant="body2" noWrap sx={{ width: '100%', textAlign: 'center' }}>{file.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {file.type === 'directory' ? 'Folder' : formatSize(file.size)}
                              </Typography>
                            </Box>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}
          </Paper>

          {/* Status bar */}
          <Box sx={{ mt: 1, px: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              {filteredFiles.length} items {selectedFiles.size > 0 && `• ${selectedFiles.size} selected`}
            </Typography>
            {clipboard && (
              <Chip size="small" label={`${clipboard.items.length} item(s) in clipboard (${clipboard.operation})`} onDelete={() => setClipboard(null)} />
            )}
          </Box>
        </Box>
      </Box>

      {/* Context Menu */}
      <Menu open={!!contextMenu} onClose={() => setContextMenu(null)} anchorReference="anchorPosition" anchorPosition={contextMenu ? { top: contextMenu.y, left: contextMenu.x } : undefined}>
        {contextFile?.type === 'file' && (
          <MenuItem onClick={() => { openPreview(contextFile); setContextMenu(null); }}><ListItemIcon><Visibility fontSize="small" /></ListItemIcon><ListItemText>View</ListItemText></MenuItem>
        )}
        {contextFile?.type === 'file' && (
          <MenuItem onClick={() => { openEditor(contextFile); setContextMenu(null); }}><ListItemIcon><Edit fontSize="small" /></ListItemIcon><ListItemText>Edit</ListItemText></MenuItem>
        )}
        <MenuItem onClick={() => { setSelectedFile(contextFile); renameForm.setValue('newName', contextFile?.name || ''); setRenameDialogOpen(true); setContextMenu(null); }}>
          <ListItemIcon><DriveFileMove fontSize="small" /></ListItemIcon><ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCopy}><ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon><ListItemText>Copy</ListItemText></MenuItem>
        <MenuItem onClick={handleCut}><ListItemIcon><ContentCut fontSize="small" /></ListItemIcon><ListItemText>Cut</ListItemText></MenuItem>
        <Divider />
        <MenuItem onClick={() => { openPermissionsDialog(contextFile!); setContextMenu(null); }}><ListItemIcon><Lock fontSize="small" /></ListItemIcon><ListItemText>Permissions</ListItemText></MenuItem>
        <MenuItem onClick={() => { setSelectedFile(contextFile); setDeleteDialogOpen(true); setContextMenu(null); }}><ListItemIcon><Delete fontSize="small" color="error" /></ListItemIcon><ListItemText>Delete</ListItemText></MenuItem>
      </Menu>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={createForm.handleSubmit(handleCreate)}>
          <DialogTitle>Create {createType === 'directory' ? 'Folder' : 'File'}</DialogTitle>
          <DialogContent>
            <TextField autoFocus fullWidth label="Name" margin="normal" {...createForm.register('name')} error={!!createForm.formState.errors.name} helperText={createForm.formState.errors.name?.message} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={actionLoading}>{actionLoading ? <CircularProgress size={20} /> : 'Create'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={renameForm.handleSubmit(handleRename)}>
          <DialogTitle>Rename</DialogTitle>
          <DialogContent>
            <TextField autoFocus fullWidth label="New Name" margin="normal" {...renameForm.register('newName')} error={!!renameForm.formState.errors.newName} helperText={renameForm.formState.errors.newName?.message} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={actionLoading}>{actionLoading ? <CircularProgress size={20} /> : 'Rename'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete"
        message={selectedFile ? `Delete "${selectedFile.name}"?` : `Delete ${selectedFiles.size} selected item(s)?`}
        confirmText="Delete"
        variant="error"
        loading={actionLoading}
      />

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onClose={() => setPreviewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">{selectedFile?.name}</Typography>
            <Typography variant="caption" color="text.secondary">{selectedFile?.path}</Typography>
          </Box>
          <IconButton onClick={() => setPreviewDialogOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50', maxHeight: 400, overflow: 'auto' }}>
            <Typography component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', whiteSpace: 'pre-wrap', m: 0 }}>{fileContent}</Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
          <Button onClick={() => { setPreviewDialogOpen(false); openEditor(selectedFile!); }}>Edit</Button>
          <Button variant="contained" startIcon={<Download />}>Download</Button>
        </DialogActions>
      </Dialog>

      {/* Editor Dialog */}
      <Dialog open={editorDialogOpen} onClose={() => setEditorDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Edit: {selectedFile?.name}</Typography>
          <IconButton onClick={() => setEditorDialogOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={20}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            sx={{ fontFamily: 'monospace', '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.875rem' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditorDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" startIcon={actionLoading ? <CircularProgress size={16} /> : <Save />} onClick={handleSaveFile} disabled={actionLoading}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={permissionsDialogOpen} onClose={() => setPermissionsDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>File Permissions</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>{selectedFile?.name}</Typography>
          <Typography variant="h6" sx={{ fontFamily: 'monospace', my: 2, textAlign: 'center' }}>{getNumericPermissions()}</Typography>
          
          <Grid container spacing={1}>
            <Grid size={4}><Typography variant="subtitle2">Owner</Typography></Grid>
            <Grid size={4}><Typography variant="subtitle2">Group</Typography></Grid>
            <Grid size={4}><Typography variant="subtitle2">Other</Typography></Grid>
            
            <Grid size={4}><FormControlLabel control={<Checkbox size="small" checked={permissions.ownerRead} onChange={(e) => setPermissions(p => ({ ...p, ownerRead: e.target.checked }))} />} label="Read" /></Grid>
            <Grid size={4}><FormControlLabel control={<Checkbox size="small" checked={permissions.groupRead} onChange={(e) => setPermissions(p => ({ ...p, groupRead: e.target.checked }))} />} label="Read" /></Grid>
            <Grid size={4}><FormControlLabel control={<Checkbox size="small" checked={permissions.otherRead} onChange={(e) => setPermissions(p => ({ ...p, otherRead: e.target.checked }))} />} label="Read" /></Grid>
            
            <Grid size={4}><FormControlLabel control={<Checkbox size="small" checked={permissions.ownerWrite} onChange={(e) => setPermissions(p => ({ ...p, ownerWrite: e.target.checked }))} />} label="Write" /></Grid>
            <Grid size={4}><FormControlLabel control={<Checkbox size="small" checked={permissions.groupWrite} onChange={(e) => setPermissions(p => ({ ...p, groupWrite: e.target.checked }))} />} label="Write" /></Grid>
            <Grid size={4}><FormControlLabel control={<Checkbox size="small" checked={permissions.otherWrite} onChange={(e) => setPermissions(p => ({ ...p, otherWrite: e.target.checked }))} />} label="Write" /></Grid>
            
            <Grid size={4}><FormControlLabel control={<Checkbox size="small" checked={permissions.ownerExecute} onChange={(e) => setPermissions(p => ({ ...p, ownerExecute: e.target.checked }))} />} label="Execute" /></Grid>
            <Grid size={4}><FormControlLabel control={<Checkbox size="small" checked={permissions.groupExecute} onChange={(e) => setPermissions(p => ({ ...p, groupExecute: e.target.checked }))} />} label="Execute" /></Grid>
            <Grid size={4}><FormControlLabel control={<Checkbox size="small" checked={permissions.otherExecute} onChange={(e) => setPermissions(p => ({ ...p, otherExecute: e.target.checked }))} />} label="Execute" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPermissionsDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSavePermissions} disabled={actionLoading}>{actionLoading ? <CircularProgress size={20} /> : 'Apply'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
