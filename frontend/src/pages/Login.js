import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Stack,
  Fade,
  Grow,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        px: 2,
      }}
    >
      {/* Decorative circles */}
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,107,53,0.1)',
        }}
      />

      <Grow in timeout={600}>
        <Card
          sx={{
            maxWidth: 440,
            width: '100%',
            backdropFilter: 'blur(20px)',
            background: 'rgba(255,255,255,0.97)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            border: 'none',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
            {/* Logo */}
            <Stack alignItems="center" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #1a73e8, #4a90e2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 4px 16px rgba(26, 115, 232, 0.3)',
                }}
              >
                <Typography sx={{ fontSize: '1.5rem' }}>💬</Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  color: '#1a1a2e',
                  fontWeight: 800,
                  mb: 0.5,
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Sign in to continue to SocialPost
              </Typography>
            </Stack>

            {/* Error alert */}
            <Fade in={!!error}>
              <Box>
                {error && (
                  <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}
              </Box>
            </Fade>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2} sx={{ mb: 3 }}>
                <TextField
                  id="login-email"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="you@example.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#65676b', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ sx: { color: '#65676b' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#1a1a2e',
                      '& fieldset': { borderColor: 'rgba(0,0,0,0.2)' },
                    },
                    '& .MuiInputBase-input::placeholder': { color: '#999' },
                  }}
                />
                <TextField
                  id="login-password"
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Enter your password"
                  InputLabelProps={{ sx: { color: '#65676b' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#1a1a2e',
                      '& fieldset': { borderColor: 'rgba(0,0,0,0.2)' },
                    },
                    '& .MuiInputBase-input::placeholder': { color: '#999' },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#65676b', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? (
                            <VisibilityOff sx={{ fontSize: 20 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 20 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <Button
                id="login-submit"
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mb: 2.5,
                  py: 1.5,
                  fontSize: '0.95rem',
                  background: 'linear-gradient(135deg, #1a73e8, #4a90e2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1557b0, #1a73e8)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </Box>

            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              Don't have an account?{' '}
              <Link
                component={RouterLink}
                to="/signup"
                underline="hover"
                sx={{ fontWeight: 600 }}
              >
                Create Account
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Grow>
    </Box>
  );
};

export default Login;
