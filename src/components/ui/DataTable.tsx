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
  LinearProgress,
} from '@mui/material';
import { Search, Refresh } from '@mui/icons-material';
import { TableSkeleton } from './LoadingSkeleton';

export interface Column<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: unknown, row: T) => ReactNode;
  sortable?: boolean;
  /** @deprecated No longer used - tables are always shown with all columns */
  mobileShow?: boolean;
  /** @deprecated No longer used - tables are always shown with all columns */
  mobileLabel?: string;
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
  /** @deprecated No longer used - proper tables are always shown */
  mobileCardRender?: (row: T, actions?: ReactNode) => ReactNode;
  /** Enable compact mode for smaller screens */
  compact?: boolean;
  /** Enable sticky first column */
  stickyFirstColumn?: boolean;
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
  compact = false,
  stickyFirstColumn = false,
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

  // Compact cell padding for mobile
  const cellSx = {
    px: isMobile || compact ? 1 : 2,
    py: isMobile || compact ? 0.75 : 1,
    fontSize: isMobile || compact ? '0.8125rem' : 'inherit',
  };

  // Build cell styles with optional minWidth and sticky positioning
  const getCellSx = (column: Column<T>, isHeader: boolean, isFirstColumn: boolean) => {
    const baseSx = {
      ...cellSx,
      ...(column.minWidth ? { minWidth: column.minWidth } : {}),
      ...(isHeader ? { fontWeight: 600, whiteSpace: 'nowrap' as const } : {}),
    };
    
    if (isFirstColumn && stickyFirstColumn) {
      return {
        ...baseSx,
        position: 'sticky' as const,
        left: 0,
        zIndex: isHeader ? 3 : 1,
        backgroundColor: isHeader ? theme.palette.background.default : theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
      };
    }
    
    return baseSx;
  };

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
          gap: 1,
        }}
      >
        {title && (
          <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={600}>
            {title}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flex: isMobile ? 1 : 'none' }}>
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: isMobile ? 'auto' : 250, flex: isMobile ? 1 : 'none' }}
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
              <IconButton onClick={onRefresh} disabled={loading} size={isMobile ? 'small' : 'medium'}>
                <Refresh />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Table - ALWAYS proper column/row based table */}
      <TableContainer 
        component={Paper} 
        variant="outlined" 
        sx={{ 
          borderRadius: 2,
          // Enable horizontal scrolling on mobile
          overflowX: 'auto',
          // Smooth scrolling
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {loading && <LinearProgress />}
        <Table size={isMobile || compact ? 'small' : 'medium'} sx={{ minWidth: isMobile ? 600 : 'auto' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
              {columns.map((column, index) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  sx={getCellSx(column, true, index === 0)}
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
              {actions && (
                <TableCell 
                  align="right" 
                  sx={{
                    ...cellSx,
                    fontWeight: 600, 
                    whiteSpace: 'nowrap',
                  }}
                >
                  Actions
                </TableCell>
              )}
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
                  {columns.map((column, index) => (
                    <TableCell 
                      key={String(column.id)} 
                      align={column.align}
                      sx={getCellSx(column, false, index === 0)}
                    >
                      {column.format
                        ? column.format(row[column.id as keyof T], row)
                        : String(row[column.id as keyof T] ?? '-')}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell 
                      align="right"
                      sx={cellSx}
                    >
                      {actions(row)}
                    </TableCell>
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
          labelRowsPerPage={isMobile ? 'Rows:' : 'Rows per page:'}
          sx={{
            '& .MuiTablePagination-toolbar': {
              flexWrap: 'wrap',
              justifyContent: isMobile ? 'center' : 'flex-end',
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: isMobile ? '0.75rem' : undefined,
            },
          }}
        />
      </TableContainer>
    </Box>
  );
}
