import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();

  // Generate a consistent color based on username
  const getAvatarColor = (name) => {
    const colors = [
      '#1a73e8', '#34a853', '#ea4335', '#fbbc04',
      '#ff6b35', '#8e24aa', '#00897b', '#e91e63',
    ];
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const isDark = mode === 'dark';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: isDark
          ? 'rgba(30, 30, 30, 0.92)'
          : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: isDark
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid rgba(0,0,0,0.08)',
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 680,
          width: '100%',
          mx: 'auto',
          px: { xs: 1.5, sm: 3 },
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1a73e8, #4a90e2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(26,115,232,0.25)',
            }}
          >
            <Typography sx={{ fontSize: '1.1rem', lineHeight: 1 }}>💬</Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: 'text.primary',
              fontWeight: 800,
              fontSize: { xs: '1rem', sm: '1.15rem' },
              letterSpacing: '-0.02em',
            }}
          >
            Social
            <Box component="span" sx={{ color: 'primary.main' }}>
              Post
            </Box>
          </Typography>
        </Box>

        {/* User section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
          {/* Light/Dark toggle */}
          <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'} arrow>
            <IconButton
              id="theme-toggle"
              onClick={toggleTheme}
              size="small"
              sx={{
                color: isDark ? '#fbbc04' : '#65676b',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: isDark
                    ? 'rgba(251, 188, 4, 0.12)'
                    : 'rgba(0,0,0,0.06)',
                  transform: 'rotate(30deg)',
                },
              }}
            >
              {isDark ? (
                <LightModeIcon sx={{ fontSize: 22 }} />
              ) : (
                <DarkModeIcon sx={{ fontSize: 22 }} />
              )}
            </IconButton>
          </Tooltip>

          <Chip
            avatar={
              <Avatar
                sx={{
                  bgcolor: getAvatarColor(user?.username),
                  width: 28,
                  height: 28,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            }
            label={user?.username}
            variant="outlined"
            sx={{
              borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
              color: 'text.primary',
              fontWeight: 500,
              fontSize: '0.8rem',
              display: { xs: 'none', sm: 'flex' },
              '& .MuiChip-label': { px: 1 },
            }}
          />
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: getAvatarColor(user?.username),
              fontSize: '0.8rem',
              fontWeight: 700,
              display: { xs: 'flex', sm: 'none' },
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Button
            id="navbar-logout"
            variant="text"
            size="small"
            onClick={logout}
            startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
            sx={{
              fontSize: '0.8rem',
              color: 'text.secondary',
              minWidth: 'auto',
              px: { xs: 1, sm: 1.5 },
              '&:hover': {
                color: 'error.main',
                bgcolor: isDark
                  ? 'rgba(242, 139, 130, 0.12)'
                  : 'rgba(234, 67, 53, 0.06)',
              },
            }}
          >
            <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Logout</Box>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
