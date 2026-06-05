import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Button,
  Chip,
  Skeleton,
  Alert,
  Stack,
  Paper,
  Fade,
  Grow,
  LinearProgress,
  Snackbar,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  KeyboardArrowDown as LoadMoreIcon,
  TrendingUp as TrendingIcon,
  DynamicFeed as FeedIcon,
} from '@mui/icons-material';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import api from '../api';

const Feed = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const POSTS_PER_PAGE = 10;

  // Fetch posts
  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    try {
      const res = await api.get(`/posts?page=${pageNum}&limit=${POSTS_PER_PAGE}`);
      const { posts: newPosts, pagination } = res.data;

      if (append) {
        setPosts((prev) => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }

      setTotalPages(pagination.pages);
      setTotal(pagination.total);
      setPage(pageNum);
      setError('');
    } catch (err) {
      console.error('Fetch posts error:', err);
      setError('Failed to load posts. Please try again.');
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      await fetchPosts(1, false);
      setLoading(false);
    };
    loadInitial();
  }, [fetchPosts]);

  // Refresh feed
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts(1, false);
    setRefreshing(false);
  };

  // Load more posts (pagination)
  const handleLoadMore = async () => {
    if (page >= totalPages || loadingMore) return;
    setLoadingMore(true);
    await fetchPosts(page + 1, true);
    setLoadingMore(false);
  };

  // Handle new post created
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setTotal((prev) => prev + 1);
    setSnackbar({ open: true, message: 'Post created successfully! 🎉', severity: 'success' });
  };

  // Handle post updated (like/comment)
  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  // Handle post deleted
  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    setTotal((prev) => prev - 1);
    setSnackbar({ open: true, message: 'Post deleted.', severity: 'info' });
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        bgcolor: 'background.default',
        pt: { xs: 1.5, sm: 2.5 },
        pb: 4,
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Loading bar at top */}
      <Fade in={refreshing || loadingMore}>
        <LinearProgress
          sx={{
            position: 'fixed',
            top: { xs: 56, sm: 64 },
            left: 0,
            right: 0,
            zIndex: 1200,
            height: 3,
          }}
        />
      </Fade>

      <Container
        maxWidth="sm"
        sx={{
          px: { xs: 1, sm: 2 },
          maxWidth: { xs: '100%', sm: 680 },
        }}
      >
        {/* Feed Header */}
        <Fade in timeout={400}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2, px: 0.5 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Badge
                badgeContent={total > 0 ? total : 0}
                color="primary"
                max={999}
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.65rem',
                    height: 18,
                    minWidth: 18,
                    fontWeight: 700,
                  },
                }}
              >
                <TrendingIcon sx={{ color: 'primary.main', fontSize: 24 }} />
              </Badge>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.05rem', sm: '1.15rem' },
                  color: 'text.primary',
                }}
              >
                Social Feed
              </Typography>
            </Stack>

            <Button
              id="refresh-feed"
              size="small"
              onClick={handleRefresh}
              disabled={refreshing}
              startIcon={
                refreshing ? (
                  <CircularProgress size={14} />
                ) : (
                  <RefreshIcon sx={{ fontSize: 18 }} />
                )
              }
              sx={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'text.secondary',
                minWidth: 'auto',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              Refresh
            </Button>
          </Stack>
        </Fade>

        {/* Create Post */}
        <Grow in timeout={500}>
          <Box>
            <CreatePost onPostCreated={handlePostCreated} />
          </Box>
        </Grow>

        {/* Error */}
        <Fade in={!!error}>
          <Box>
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2, borderRadius: 3 }}
                action={
                  <Button color="inherit" size="small" onClick={handleRefresh}>
                    Retry
                  </Button>
                }
              >
                {error}
              </Alert>
            )}
          </Box>
        </Fade>

        {/* Loading Skeletons */}
        {loading && (
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Fade in key={i} timeout={300 + i * 200}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                    <Skeleton variant="circular" width={42} height={42} animation="wave" />
                    <Stack spacing={0.5}>
                      <Skeleton width={120} height={18} animation="wave" />
                      <Skeleton width={80} height={14} animation="wave" />
                    </Stack>
                  </Stack>
                  <Skeleton width="100%" height={18} animation="wave" sx={{ mb: 0.5 }} />
                  <Skeleton width="80%" height={18} animation="wave" sx={{ mb: 1 }} />
                  {i === 2 && (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={200}
                      animation="wave"
                      sx={{ borderRadius: 2, mb: 1 }}
                    />
                  )}
                  <Divider sx={{ my: 1.5 }} />
                  <Stack direction="row" spacing={2}>
                    <Skeleton width={80} height={32} animation="wave" />
                    <Skeleton width={100} height={32} animation="wave" />
                  </Stack>
                </Paper>
              </Fade>
            ))}
          </Stack>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && !error && (
          <Fade in timeout={600}>
            <Paper
              elevation={0}
              sx={{
                textAlign: 'center',
                py: 8,
                px: 3,
                borderRadius: 4,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
              }}
            >
              <FeedIcon
                sx={{
                  fontSize: 64,
                  color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                  mb: 2,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                No posts yet
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 300,
                  mx: 'auto',
                }}
              >
                Be the first one to share something! Create a post above to get started.
              </Typography>
            </Paper>
          </Fade>
        )}

        {/* Posts with Grow animation */}
        <Stack spacing={0}>
          {!loading &&
            posts.map((post, index) => (
              <Grow
                in
                key={post._id}
                timeout={300 + Math.min(index, 5) * 100}
              >
                <Box>
                  <PostCard
                    post={post}
                    index={index}
                    onPostUpdate={handlePostUpdate}
                    onPostDelete={handlePostDelete}
                  />
                </Box>
              </Grow>
            ))}
        </Stack>

        {/* Load More */}
        {!loading && page < totalPages && (
          <Fade in timeout={500}>
            <Box sx={{ textAlign: 'center', mt: 2, mb: 2 }}>
              <Button
                id="load-more"
                onClick={handleLoadMore}
                disabled={loadingMore}
                variant="outlined"
                endIcon={
                  loadingMore ? (
                    <CircularProgress size={16} />
                  ) : (
                    <LoadMoreIcon />
                  )
                }
                sx={{
                  borderRadius: 8,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    bgcolor: isDark
                      ? 'rgba(91,156,246,0.08)'
                      : 'rgba(26,115,232,0.04)',
                  },
                }}
              >
                Load More Posts
              </Button>
            </Box>
          </Fade>
        )}

        {/* End of feed */}
        {!loading && posts.length > 0 && page >= totalPages && (
          <Fade in timeout={500}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
              sx={{ mt: 3, mb: 2 }}
            >
              <Divider sx={{ flex: 1, maxWidth: 80 }} />
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.78rem',
                }}
              >
                ✨ You've reached the end
              </Typography>
              <Divider sx={{ flex: 1, maxWidth: 80 }} />
            </Stack>
          </Fade>
        )}
      </Container>

      {/* MUI Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            borderRadius: 3,
            fontWeight: 600,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Feed;
