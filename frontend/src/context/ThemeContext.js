import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme } from '@mui/material';

const ThemeContext = createContext(null);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
};

// Shared component overrides for both themes
const getComponentOverrides = (mode) => ({
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 10,
        padding: '10px 24px',
        transition: 'all 0.2s ease',
      },
      contained: {
        boxShadow: '0 2px 8px rgba(26, 115, 232, 0.3)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(26, 115, 232, 0.4)',
          transform: 'translateY(-1px)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: mode === 'dark'
          ? '0 1px 4px rgba(0,0,0,0.3)'
          : '0 1px 4px rgba(0,0,0,0.06)',
        border: mode === 'dark'
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease, background-color 0.3s ease',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 10,
          transition: 'box-shadow 0.2s ease',
          '&.Mui-focused': {
            boxShadow: '0 0 0 3px rgba(26, 115, 232, 0.15)',
          },
        },
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        fontWeight: 600,
        fontSize: '0.875rem',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 500,
      },
    },
  },
});

// Light theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a73e8',
      light: '#4a90e2',
      dark: '#1557b0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6b35',
      light: '#ff8c5a',
      dark: '#e55a25',
    },
    success: { main: '#34a853' },
    error: { main: '#ea4335' },
    background: {
      default: '#f0f2f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#65676b',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 700, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 600 },
    body1: { fontSize: '0.938rem', lineHeight: 1.6 },
    body2: { fontSize: '0.85rem', lineHeight: 1.5 },
    button: { fontWeight: 600, letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    '0 2px 8px rgba(0,0,0,0.08)',
    '0 4px 16px rgba(0,0,0,0.08)',
    '0 6px 20px rgba(0,0,0,0.1)',
    '0 8px 28px rgba(0,0,0,0.12)',
    ...Array(19).fill('0 8px 28px rgba(0,0,0,0.12)'),
  ],
  components: getComponentOverrides('light'),
});

// Dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5b9cf6',
      light: '#8ab8f8',
      dark: '#1a73e8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff8c5a',
      light: '#ffb088',
      dark: '#ff6b35',
    },
    success: { main: '#5bb974' },
    error: { main: '#f28b82' },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#e8eaed',
      secondary: '#9aa0a6',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 700, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 600 },
    body1: { fontSize: '0.938rem', lineHeight: 1.6 },
    body2: { fontSize: '0.85rem', lineHeight: 1.5 },
    button: { fontWeight: 600, letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
    '0 2px 8px rgba(0,0,0,0.35)',
    '0 4px 16px rgba(0,0,0,0.35)',
    '0 6px 20px rgba(0,0,0,0.4)',
    '0 8px 28px rgba(0,0,0,0.45)',
    ...Array(19).fill('0 8px 28px rgba(0,0,0,0.45)'),
  ],
  components: getComponentOverrides('dark'),
});

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('themeMode');
    return saved || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    // Update meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', mode === 'dark' ? '#121212' : '#1a73e8');
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

  const value = { mode, toggleTheme, theme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
