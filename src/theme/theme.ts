'use client';

import { createTheme, ThemeOptions, alpha } from '@mui/material/styles';

// Mantis-inspired design tokens
const designTokens = {
  colors: {
    primary: {
      lighter: '#E3F2FD',
      light: '#90CAF9',
      main: '#1677FF',
      dark: '#0958D9',
      darker: '#003EB3',
      contrastText: '#FFFFFF',
    },
    secondary: {
      lighter: '#EDE7F6',
      light: '#B39DDB',
      main: '#7C4DFF',
      dark: '#651FFF',
      darker: '#4A148C',
      contrastText: '#FFFFFF',
    },
    success: {
      lighter: '#E8F5E9',
      light: '#81C784',
      main: '#52C41A',
      dark: '#389E0D',
      darker: '#237804',
      contrastText: '#FFFFFF',
    },
    warning: {
      lighter: '#FFF8E1',
      light: '#FFD54F',
      main: '#FAAD14',
      dark: '#D48806',
      darker: '#AD6800',
      contrastText: '#FFFFFF',
    },
    error: {
      lighter: '#FFEBEE',
      light: '#EF9A9A',
      main: '#FF4D4F',
      dark: '#CF1322',
      darker: '#A8071A',
      contrastText: '#FFFFFF',
    },
    info: {
      lighter: '#E0F7FA',
      light: '#80DEEA',
      main: '#13C2C2',
      dark: '#08979C',
      darker: '#006D75',
      contrastText: '#FFFFFF',
    },
  },
  borderRadius: {
    xs: 2,
    sm: 4,
    md: 4,
    lg: 8,
    xl: 12,
    full: 9999,
  },
};

// Common theme options (Mantis-inspired)
const getCommonOptions = (): ThemeOptions => ({
  typography: {
    fontFamily: '"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2.375rem',
      fontWeight: 700,
      lineHeight: 1.21,
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 700,
      lineHeight: 1.27,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.33,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.57,
    },
    subtitle1: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.57,
    },
    subtitle2: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.66,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.66,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'capitalize',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.66,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      lineHeight: 1.66,
    },
  },
  shape: {
    borderRadius: 4,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 1024,
      lg: 1266,
      xl: 1440,
    },
  },
  mixins: {
    toolbar: {
      minHeight: 60,
      paddingTop: 8,
      paddingBottom: 8,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.sm,
          fontWeight: 600,
        },
        sizeLarge: {
          padding: '10px 22px',
          fontSize: '0.9375rem',
        },
        sizeMedium: {
          padding: '8px 16px',
        },
        sizeSmall: {
          padding: '5px 12px',
          fontSize: '0.8125rem',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: designTokens.colors.primary.dark,
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.lg,
          boxShadow: 'none',
          border: '1px solid',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 20,
          '&:last-child': {
            paddingBottom: 20,
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '20px 20px 0',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.lg,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.xs,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.sm,
        },
        input: {
          padding: '10.5px 14px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: designTokens.borderRadius.lg,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.full,
          height: 6,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.sm,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.sm,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          borderColor: 'inherit',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-of-type .MuiTableCell-root': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 46,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 46,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: designTokens.borderRadius.xs,
          fontSize: '0.6875rem',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        standard: {
          minWidth: 18,
          height: 18,
          fontSize: '0.675rem',
          padding: '0 4px',
        },
      },
    },
  },
});

// Light theme (Mantis-inspired)
export const lightTheme = createTheme({
  ...getCommonOptions(),
  palette: {
    mode: 'light',
    primary: {
      lighter: designTokens.colors.primary.lighter,
      light: designTokens.colors.primary.light,
      main: designTokens.colors.primary.main,
      dark: designTokens.colors.primary.dark,
      contrastText: designTokens.colors.primary.contrastText,
    },
    secondary: {
      lighter: designTokens.colors.secondary.lighter,
      light: designTokens.colors.secondary.light,
      main: designTokens.colors.secondary.main,
      dark: designTokens.colors.secondary.dark,
      contrastText: designTokens.colors.secondary.contrastText,
    },
    success: {
      lighter: designTokens.colors.success.lighter,
      light: designTokens.colors.success.light,
      main: designTokens.colors.success.main,
      dark: designTokens.colors.success.dark,
      contrastText: designTokens.colors.success.contrastText,
    },
    warning: {
      lighter: designTokens.colors.warning.lighter,
      light: designTokens.colors.warning.light,
      main: designTokens.colors.warning.main,
      dark: designTokens.colors.warning.dark,
      contrastText: designTokens.colors.warning.contrastText,
    },
    error: {
      lighter: designTokens.colors.error.lighter,
      light: designTokens.colors.error.light,
      main: designTokens.colors.error.main,
      dark: designTokens.colors.error.dark,
      contrastText: designTokens.colors.error.contrastText,
    },
    info: {
      lighter: designTokens.colors.info.lighter,
      light: designTokens.colors.info.light,
      main: designTokens.colors.info.main,
      dark: designTokens.colors.info.dark,
      contrastText: designTokens.colors.info.contrastText,
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#262626',
      secondary: '#8C8C8C',
    },
    divider: '#E6E8EB',
    action: {
      hover: alpha('#1677FF', 0.06),
      selected: alpha('#1677FF', 0.08),
      focus: alpha('#1677FF', 0.12),
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  components: {
    ...getCommonOptions().components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#262626',
          boxShadow: 'none',
          borderBottom: '1px solid #E6E8EB',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.lg,
          boxShadow: 'none',
          border: '1px solid #E6E8EB',
          '&:hover': {
            boxShadow: '0 2px 14px 0 rgba(32, 40, 45, 0.08)',
          },
        },
      },
    },
  },
});

// Dark theme (Mantis-inspired)
export const darkTheme = createTheme({
  ...getCommonOptions(),
  palette: {
    mode: 'dark',
    primary: {
      lighter: '#1A3353',
      light: '#4096FF',
      main: '#1677FF',
      dark: '#0958D9',
      contrastText: '#FFFFFF',
    },
    secondary: {
      lighter: '#2A1F4E',
      light: '#B39DDB',
      main: '#7C4DFF',
      dark: '#651FFF',
      contrastText: '#FFFFFF',
    },
    success: {
      lighter: '#162312',
      light: '#73D13D',
      main: '#52C41A',
      dark: '#389E0D',
      contrastText: '#FFFFFF',
    },
    warning: {
      lighter: '#2B2111',
      light: '#FFC53D',
      main: '#FAAD14',
      dark: '#D48806',
      contrastText: '#FFFFFF',
    },
    error: {
      lighter: '#2A1215',
      light: '#FF7875',
      main: '#FF4D4F',
      dark: '#CF1322',
      contrastText: '#FFFFFF',
    },
    info: {
      lighter: '#112123',
      light: '#36CFC9',
      main: '#13C2C2',
      dark: '#08979C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#121212',
      paper: '#1D1D1D',
    },
    text: {
      primary: '#F0F0F0',
      secondary: '#8C8C8C',
    },
    divider: alpha('#FFFFFF', 0.12),
    action: {
      hover: alpha('#1677FF', 0.12),
      selected: alpha('#1677FF', 0.16),
      focus: alpha('#1677FF', 0.2),
    },
    grey: {
      50: '#2A2A2A',
      100: '#333333',
      200: '#424242',
      300: '#525252',
      400: '#6B6B6B',
      500: '#8C8C8C',
      600: '#A3A3A3',
      700: '#BFBFBF',
      800: '#D9D9D9',
      900: '#F0F0F0',
    },
  },
  components: {
    ...getCommonOptions().components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1D1D1D',
          color: '#F0F0F0',
          boxShadow: 'none',
          borderBottom: `1px solid ${alpha('#FFFFFF', 0.12)}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.lg,
          boxShadow: 'none',
          border: `1px solid ${alpha('#FFFFFF', 0.12)}`,
          backgroundColor: '#1D1D1D',
          '&:hover': {
            boxShadow: '0 2px 14px 0 rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: designTokens.borderRadius.lg,
        },
      },
    },
  },
});

export { designTokens };
