'use client';

import { useState, useMemo, ReactNode } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  Chip,
  LinearProgress,
} from '@mui/material';
import { Search, Refresh, FilterList } from '@mui/icons-material';
import { TableSkeleton } from './LoadingSkeleton';

export interface Column<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: unknown, row: T) => ReactNode;
  sortable?: boolean;
  mobileShow?: boolean; // Show in mobile card view
  mobileLabel?: string; // Label for mobile view
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  title?: string;
  searchPlaceholder?: string;
  onRefresh?: () => void;
  getRowId: (row: T) => string | number;
  actions?: (row: T) => ReactNode;
  emptyMessage?: string;
  rowsPerPageOptions?: number[];
  mobileCardRender?: (row: T, actions?: ReactNode) => ReactNode;
}

type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  const aVal = a[orderBy];
  const bVal = b[orderBy];
  
  if (bVal < aVal) return -1;
  if (bVal > aVal) return 1;
  return 0;
}

function getComparator<T>(order: Order, orderBy: keyof T): (a: T, b: T) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function DataTable<T extends object>({
  columns,
  data,
  loading = false,
  title,
  searchPlaceholder = 'Search...',
  onRefresh,
  getRowId,
  actions,
  emptyMessage = 'No data available',
  rowsPerPageOptions = [10, 25, 50],
  mobileCardRender,
}: DataTableProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof T | ''>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    
    const query = searchQuery.toLowerCase();
    return data.filter((row) => {
      return columns.some((column) => {
        const value = row[column.id as keyof T];
        if (value == null) return false;
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;
    return [...filteredData].sort(getComparator(order, orderBy as keyof T));
  }, [filteredData, order, orderBy]);

  // Paginate data
  const paginatedData = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  // Mobile card view
  if (isMobile) {
    return (
      <Box>
        {/* Header */}
        <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {title && (
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
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
            {onRefresh && (
              <IconButton onClick={onRefresh} disabled={loading}>
                <Refresh />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Loading */}
        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Cards */}
        <Stack spacing={2}>
          {paginatedData.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">{emptyMessage}</Typography>
            </Paper>
          ) : (
            paginatedData.map((row) => {
              if (mobileCardRender) {
                return (
                  <Box key={getRowId(row)}>
                    {mobileCardRender(row, actions ? actions(row) : undefined)}
                  </Box>
                );
              }
              
              return (
                <Card key={getRowId(row)} variant="outlined">
                  <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                    {columns
                      .filter((col) => col.mobileShow !== false)
                      .map((column) => (
                        <Box
                          key={String(column.id)}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 0.5,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {column.mobileLabel || column.label}
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {column.format
                              ? column.format(row[column.id as keyof T], row)
                              : String(row[column.id as keyof T] ?? '-')}
                          </Typography>
                        </Box>
                      ))}
                    {actions && (
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        {actions(row)}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </Stack>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          sx={{ mt: 2 }}
        />
      </Box>
    );
  }

  // Desktop table view
  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {title && (
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder={searchPlaceholder}
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
          {onRefresh && (
            <Tooltip title="Refresh">
              <IconButton onClick={onRefresh} disabled={loading}>
                <Refresh />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        {loading && <LinearProgress />}
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  sx={{ minWidth: column.minWidth, fontWeight: 600 }}
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id as keyof T)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {actions && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton rows={rowsPerPage} columns={columns.length + (actions ? 1 : 0)} />
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  sx={{ textAlign: 'center', py: 4 }}
                >
                  <Typography color="text.secondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow hover key={getRowId(row)}>
                  {columns.map((column) => (
                    <TableCell key={String(column.id)} align={column.align}>
                      {column.format
                        ? column.format(row[column.id as keyof T], row)
                        : String(row[column.id as keyof T] ?? '-')}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell align="right">{actions(row)}</TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </TableContainer>
    </Box>
  );
}
