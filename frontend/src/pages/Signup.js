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
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (form.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(form.username, form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Signup failed. Please try again.';
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
        py: 4,
      }}
    >
      {/* Decorative circles */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -60,
          right: -60,
          width: 250,
          height: 250,
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
                  background: 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
                }}
              >
                <Typography sx={{ fontSize: '1.5rem' }}>🚀</Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  color: '#1a1a2e',
                  fontWeight: 800,
                  mb: 0.5,
                }}
              >
                Create Account
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Join SocialPost and start sharing
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
                  id="signup-username"
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="johndoe"
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
                        <PersonIcon sx={{ color: '#65676b', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  id="signup-email"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="you@example.com"
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
                        <EmailIcon sx={{ color: '#65676b', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  id="signup-password"
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="At least 6 characters"
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
                          sx={{ color: '#65676b' }}
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
                <TextField
                  id="signup-confirm-password"
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Repeat password"
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
                          onClick={() => setShowConfirm(!showConfirm)}
                          edge="end"
                          size="small"
                          aria-label="toggle confirm password visibility"
                          sx={{ color: '#65676b' }}
                        >
                          {showConfirm ? (
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
                id="signup-submit"
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mb: 2.5,
                  py: 1.5,
                  fontSize: '0.95rem',
                  background: 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
                  boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e55a25, #ff6b35)',
                    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Create Account'
                )}
              </Button>
            </Box>

            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                underline="hover"
                sx={{ fontWeight: 600 }}
              >
                Sign In
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Grow>
    </Box>
  );
};

export default Signup;
