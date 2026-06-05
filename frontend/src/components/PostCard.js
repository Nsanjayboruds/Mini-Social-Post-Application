import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  TextField,
  Collapse,
  Divider,
  Chip,
  CircularProgress,
  Tooltip,
  Stack,
  Zoom,
  Fade,
  useTheme,
} from '@mui/material';
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ChatBubbleOutline as CommentIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const API_BASE = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:5000';

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

// Format relative time
const formatTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

const PostCard = ({ post, onPostUpdate, onPostDelete, index = 0 }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [liking, setLiking] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);

  // Check if current user has liked this post
  const isLiked = post.likes?.some(
    (like) => like.user === user?.id || like.user?._id === user?.id
  );

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);

    // Trigger like animation
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 300);

    try {
      const res = await api.put(`/posts/${post._id}/like`);
      if (onPostUpdate) onPostUpdate(res.data);
    } catch (err) {
      console.error('Like error:', err);
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || commenting) return;

    setCommenting(true);
    try {
      const res = await api.post(`/posts/${post._id}/comment`, {
        text: commentText.trim(),
      });
      setCommentText('');
      if (onPostUpdate) onPostUpdate(res.data);
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setCommenting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${post._id}`);
      if (onPostDelete) onPostDelete(post._id);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const isOwner = user?.id === (post.user?._id || post.user);

  return (
    <Card
      sx={{
        mb: 2,
        overflow: 'hidden',
        '&:hover': {
          boxShadow: isDark
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 20px rgba(0,0,0,0.08)',
        },
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
        {/* Post Header — using MUI Stack */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <Avatar
            sx={{
              width: 42,
              height: 42,
              bgcolor: getAvatarColor(post.username),
              fontSize: '1rem',
              fontWeight: 700,
            }}
          >
            {post.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Stack sx={{ flex: 1 }} spacing={0}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3 }}
            >
              {post.username}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
              {formatTime(post.createdAt)}
            </Typography>
          </Stack>

          {isOwner && (
            <Tooltip title="Delete post" arrow placement="left">
              <IconButton
                onClick={handleDelete}
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                    bgcolor: isDark
                      ? 'rgba(242,139,130,0.12)'
                      : 'rgba(234,67,53,0.06)',
                  },
                }}
              >
                <DeleteIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        {/* Post Text */}
        {post.text && (
          <Typography
            variant="body1"
            sx={{
              mb: post.image ? 1.5 : 0,
              color: 'text.primary',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: '0.938rem',
            }}
          >
            {post.text}
          </Typography>
        )}
      </CardContent>

      {/* Post Image — using MUI CardMedia */}
      {post.image && (
        <CardMedia
          component="img"
          image={`${API_BASE}${post.image}`}
          alt="Post image"
          loading="lazy"
          sx={{
            maxHeight: 450,
            objectFit: 'cover',
            cursor: 'pointer',
            transition: 'opacity 0.3s ease',
            '&:hover': { opacity: 0.95 },
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}

      <CardContent sx={{ pt: 1.5, pb: 1, px: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
        {/* Like & Comment Counts */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1 }}
        >
          {post.likes?.length > 0 ? (
            <Tooltip
              title={post.likes.map((l) => l.username).join(', ')}
              arrow
              placement="bottom"
            >
              <Chip
                icon={<FavoriteIcon sx={{ fontSize: 14, color: '#ea4335 !important' }} />}
                label={`${post.likes.length} ${post.likes.length === 1 ? 'like' : 'likes'}`}
                variant="outlined"
                size="small"
                sx={{
                  cursor: 'pointer',
                  borderColor: 'transparent',
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  height: 24,
                  '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' },
                }}
              />
            </Tooltip>
          ) : (
            <Box />
          )}
          {post.comments?.length > 0 && (
            <Chip
              label={`${post.comments.length} ${post.comments.length === 1 ? 'comment' : 'comments'}`}
              variant="outlined"
              size="small"
              onClick={() => setShowComments(!showComments)}
              sx={{
                cursor: 'pointer',
                borderColor: 'transparent',
                color: 'text.secondary',
                fontSize: '0.75rem',
                height: 24,
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  textDecoration: 'underline',
                },
              }}
            />
          )}
        </Stack>

        {/* Divider */}
        <Divider />

        {/* Action Buttons — using MUI Stack */}
        <Stack direction="row" spacing={0} sx={{ mt: 0.5 }}>
          <Button
            id={`like-btn-${post._id}`}
            onClick={handleLike}
            disabled={liking}
            fullWidth
            startIcon={
              isLiked ? (
                <Zoom in={likeAnimation} timeout={200}>
                  <FavoriteIcon
                    sx={{
                      fontSize: 20,
                      color: '#ea4335',
                      animation: likeAnimation ? 'pulse 0.3s ease-in-out' : 'none',
                    }}
                  />
                </Zoom>
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 20 }} />
              )
            }
            sx={{
              color: isLiked ? '#ea4335' : 'text.secondary',
              fontWeight: 600,
              fontSize: '0.82rem',
              py: 0.8,
              borderRadius: 2,
              '&:hover': {
                bgcolor: isLiked
                  ? isDark ? 'rgba(242,139,130,0.12)' : 'rgba(234,67,53,0.06)'
                  : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            Like
          </Button>
          <Button
            id={`comment-btn-${post._id}`}
            onClick={() => setShowComments(!showComments)}
            fullWidth
            startIcon={<CommentIcon sx={{ fontSize: 20 }} />}
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.82rem',
              py: 0.8,
              borderRadius: 2,
              '&:hover': {
                bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            Comment
          </Button>
        </Stack>

        {/* Comments Section — with MUI Collapse */}
        <Collapse in={showComments} timeout={300}>
          <Box sx={{ mt: 1.5 }}>
            <Divider sx={{ mb: 1.5 }} />

            {/* Comment List */}
            {post.comments?.length > 0 && (
              <Stack spacing={1.5} sx={{ mb: 1.5, maxHeight: 300, overflowY: 'auto' }}>
                {post.comments.map((comment, idx) => (
                  <Fade in key={comment._id || idx} timeout={200 + idx * 50}>
                    <Stack direction="row" spacing={1}>
                      <Avatar
                        sx={{
                          width: 30,
                          height: 30,
                          bgcolor: getAvatarColor(comment.username),
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          mt: 0.3,
                        }}
                      >
                        {comment.username?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Stack
                        sx={{
                          flex: 1,
                          bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'action.hover',
                          borderRadius: 3,
                          px: 1.5,
                          py: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 700, fontSize: '0.78rem' }}
                        >
                          {comment.username}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.83rem',
                            lineHeight: 1.4,
                            color: 'text.primary',
                            wordBreak: 'break-word',
                          }}
                        >
                          {comment.text}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', fontSize: '0.68rem', mt: 0.3 }}
                        >
                          {formatTime(comment.createdAt)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Fade>
                ))}
              </Stack>
            )}

            {/* Comment Input — using MUI Stack */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: getAvatarColor(user?.username),
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <TextField
                id={`comment-input-${post._id}`}
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleComment();
                  }
                }}
                size="small"
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 5,
                    fontSize: '0.85rem',
                    bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'action.hover',
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': {
                      borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                    },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  },
                  '& .MuiOutlinedInput-input': {
                    py: 1,
                    px: 1.5,
                  },
                }}
              />
              <Tooltip title={commentText.trim() ? 'Send comment' : 'Type a comment first'} arrow>
                <span>
                  <IconButton
                    onClick={handleComment}
                    disabled={!commentText.trim() || commenting}
                    size="small"
                    color="primary"
                    sx={{
                      '&:hover': {
                        bgcolor: isDark
                          ? 'rgba(91,156,246,0.12)'
                          : 'rgba(26,115,232,0.08)',
                      },
                    }}
                  >
                    {commenting ? (
                      <CircularProgress size={18} />
                    ) : (
                      <SendIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default PostCard;
