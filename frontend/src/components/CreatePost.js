import React, { useState, useRef, useCallback } from 'react';
import {
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  Chip,
  CircularProgress,
  Collapse,
  Popover,
  Tooltip,
  Stack,
  Tabs,
  Tab,
  Fade,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  EmojiEmotions as EmojiIcon,
  CameraAlt as CameraIcon,
  FormatAlignLeft as TextFormatIcon,
  Campaign as PromoteIcon,
  DynamicFeed as AllPostsIcon,
  LocalOffer as PromoIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../api';

// Common emoji grid — curated set of popular emojis
const EMOJI_LIST = [
  '😀', '😁', '😂', '🤣', '😊', '😇', '🥰', '😍',
  '🤩', '😎', '🤗', '🤔', '😏', '😌', '😴', '🤤',
  '😋', '😛', '😜', '🤪', '😝', '🤑', '🤭', '😐',
  '😑', '😶', '😮', '😲', '🥺', '😢', '😭', '😤',
  '😠', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰',
  '🥳', '🤠', '😈', '👿', '💀', '👻', '👽', '🤖',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
  '💔', '💕', '💖', '💗', '💘', '💝', '💞', '💯',
  '🔥', '⭐', '🌟', '✨', '💫', '🎉', '🎊', '🎈',
  '👍', '👎', '👏', '🙌', '🤝', '✌️', '🤞', '💪',
  '🙏', '🫶', '👀', '🧠', '💡', '📱', '💻', '🎯',
  '🚀', '🌍', '🌈', '☀️', '🌙', '⚡', '💎', '🏆',
];

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const fileInputRef = useRef(null);
  const textFieldRef = useRef(null);

  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 = All Posts, 1 = Promotions
  const [isPromoted, setIsPromoted] = useState(false);

  // Emoji picker
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const emojiOpen = Boolean(emojiAnchor);

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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be under 5MB');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeImage = () => {
    setImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmojiSelect = useCallback((emoji) => {
    setText((prev) => prev + emoji);
    setEmojiAnchor(null);
    setTimeout(() => {
      if (textFieldRef.current) {
        const input = textFieldRef.current.querySelector('textarea') ||
                      textFieldRef.current.querySelector('input');
        if (input) input.focus();
      }
    }, 50);
  }, []);

  const handleSubmit = async () => {
    if (!text.trim() && !image) {
      setError('Please write something or add an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      if (text.trim()) formData.append('text', text.trim());
      if (image) formData.append('image', image);

      const res = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setText('');
      removeImage();
      setFocused(false);
      setIsPromoted(false);

      if (onPostCreated) {
        onPostCreated(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const isPostable = text.trim() || image;

  return (
    <Card
      sx={{
        mb: 2,
        overflow: 'visible',
        border: focused
          ? `1px solid ${isDark ? 'rgba(91,156,246,0.3)' : 'rgba(26,115,232,0.3)'}`
          : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
        boxShadow: focused
          ? isDark
            ? '0 4px 20px rgba(91,156,246,0.15)'
            : '0 4px 20px rgba(26,115,232,0.12)'
          : undefined,
        transition: 'all 0.3s ease',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
        {/* Header row: "Create Post" label + MUI Tabs */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1.5 }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: 'text.primary',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            Create Post
          </Typography>

          {/* MUI Tabs — All Posts / Promotions */}
          <Tabs
            value={activeTab}
            onChange={(e, newVal) => setActiveTab(newVal)}
            sx={{
              minHeight: 32,
              '& .MuiTabs-indicator': {
                height: '100%',
                borderRadius: 5,
                bgcolor: 'primary.main',
                zIndex: 0,
              },
              '& .MuiTabs-flexContainer': {
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: 5,
                overflow: 'hidden',
              },
            }}
          >
            <Tab
              id="tab-all-posts"
              label="All Posts"
              sx={{
                minHeight: 32,
                minWidth: 'auto',
                px: 2,
                py: 0,
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'none',
                zIndex: 1,
                color: activeTab === 0 ? '#fff !important' : 'text.secondary',
                transition: 'color 0.2s ease',
              }}
            />
            <Tab
              id="tab-promotions"
              label="Promotions"
              sx={{
                minHeight: 32,
                minWidth: 'auto',
                px: 2,
                py: 0,
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'none',
                zIndex: 1,
                color: activeTab === 1 ? '#fff !important' : 'text.secondary',
                transition: 'color 0.2s ease',
              }}
            />
          </Tabs>
        </Stack>

        {/* Input area — MUI Stack */}
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: getAvatarColor(user?.username),
              fontSize: '0.95rem',
              fontWeight: 700,
              mt: 0.5,
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1 }} ref={textFieldRef}>
            <TextField
              id="create-post-text"
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (error) setError('');
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                if (!text && !image) setFocused(false);
              }}
              multiline
              minRows={1}
              maxRows={6}
              fullWidth
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  px: 0,
                  color: 'text.primary',
                },
              }}
              sx={{
                '& .MuiInputBase-root': {
                  padding: 0,
                },
              }}
            />
          </Box>
        </Stack>

        {/* Image Preview — MUI Collapse */}
        <Collapse in={!!imagePreview}>
          {imagePreview && (
            <Box
              sx={{
                mt: 2,
                ml: 7,
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              }}
            >
              <Box
                component="img"
                src={imagePreview}
                alt="Preview"
                sx={{
                  width: '100%',
                  maxHeight: 280,
                  objectFit: 'cover',
                  display: 'block',
                  borderRadius: 2,
                }}
              />
              <IconButton
                onClick={removeImage}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                  width: 28,
                  height: 28,
                }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          )}
        </Collapse>

        {/* Error — MUI Fade */}
        <Fade in={!!error}>
          <Typography
            variant="caption"
            sx={{
              color: 'error.main',
              ml: 7,
              mt: 1,
              display: error ? 'block' : 'none',
            }}
          >
            {error}
          </Typography>
        </Fade>

        {/* Actions bar — MUI Stack + Divider */}
        <Divider sx={{ mt: 2, ml: 7 }} />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 1.5, ml: 7 }}
        >
          {/* Left icons: Camera, Emoji, Text Format, Promote */}
          <Stack direction="row" alignItems="center" spacing={0.3}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              hidden
              onChange={handleImageSelect}
              id="image-upload-input"
            />

            {/* Camera / Photo */}
            <Tooltip title="Add Photo" arrow>
              <IconButton
                id="btn-camera"
                size="small"
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  color: isDark ? 'text.secondary' : 'text.secondary',
                  '&:hover': {
                    color: 'success.main',
                    bgcolor: isDark ? 'rgba(52,168,83,0.12)' : 'rgba(52,168,83,0.08)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <CameraIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>

            {/* Emoji */}
            <Tooltip title="Add Emoji" arrow>
              <IconButton
                id="btn-emoji"
                size="small"
                onClick={(e) => setEmojiAnchor(e.currentTarget)}
                sx={{
                  color: emojiOpen ? 'warning.main' : 'text.secondary',
                  '&:hover': {
                    color: 'warning.main',
                    bgcolor: isDark ? 'rgba(251,188,4,0.12)' : 'rgba(251,188,4,0.08)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <EmojiIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>

            {/* Text Format */}
            <Tooltip title="Formatting" arrow>
              <IconButton
                id="btn-format"
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: isDark ? 'rgba(91,156,246,0.12)' : 'rgba(26,115,232,0.08)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <TextFormatIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>

            {/* MUI Divider (vertical) */}
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />

            {/* Promote — MUI Chip */}
            <Chip
              id="btn-promote"
              icon={<PromoteIcon sx={{ fontSize: 18 }} />}
              label="Promote"
              variant={isPromoted ? 'filled' : 'outlined'}
              size="small"
              onClick={() => setIsPromoted(!isPromoted)}
              color={isPromoted ? 'warning' : 'default'}
              sx={{
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.78rem',
                transition: 'all 0.2s ease',
                ...(isPromoted && {
                  bgcolor: 'secondary.main',
                  color: '#fff',
                  '& .MuiChip-icon': { color: '#fff' },
                }),
                ...(!isPromoted && {
                  borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'divider',
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'secondary.main',
                    borderColor: 'secondary.main',
                  },
                }),
              }}
            />
          </Stack>

          {/* Image filename chip */}
          {image && (
            <Fade in>
              <Chip
                label={image.name.length > 12 ? image.name.slice(0, 12) + '...' : image.name}
                size="small"
                onDelete={removeImage}
                color="primary"
                variant="outlined"
                sx={{
                  maxWidth: 120,
                  fontSize: '0.7rem',
                  height: 24,
                  display: { xs: 'none', sm: 'flex' },
                }}
              />
            </Fade>
          )}

          {/* Post button */}
          <Button
            id="submit-post"
            variant="contained"
            size="small"
            disabled={!isPostable || loading}
            onClick={handleSubmit}
            startIcon={
              loading ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <SendIcon sx={{ fontSize: 15 }} />
              )
            }
            sx={{
              px: 2,
              py: 0.7,
              fontSize: '0.82rem',
              borderRadius: 2,
              background: isPostable
                ? 'linear-gradient(135deg, #1a73e8, #4a90e2)'
                : undefined,
              boxShadow: isPostable
                ? '0 2px 8px rgba(26,115,232,0.3)'
                : 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #1557b0, #1a73e8)',
              },
              '&.Mui-disabled': {
                background: isDark ? '#333' : '#e0e0e0',
                color: isDark ? '#666' : '#9e9e9e',
              },
            }}
          >
            Post
          </Button>
        </Stack>

        {/* Emoji Picker — MUI Popover */}
        <Popover
          open={emojiOpen}
          anchorEl={emojiAnchor}
          onClose={() => setEmojiAnchor(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 3,
                boxShadow: theme.shadows[5],
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'divider'}`,
                mt: -1,
              },
            },
          }}
        >
          <Box sx={{ p: 1.5, width: 320 }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                color: 'text.secondary',
                mb: 1,
                display: 'block',
                fontSize: '0.68rem',
              }}
            >
              Pick an Emoji
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: 0.3,
                maxHeight: 240,
                overflowY: 'auto',
                '&::-webkit-scrollbar': { width: 4 },
                '&::-webkit-scrollbar-thumb': {
                  background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                  borderRadius: 4,
                },
              }}
            >
              {EMOJI_LIST.map((emoji, idx) => (
                <IconButton
                  key={idx}
                  size="small"
                  onClick={() => handleEmojiSelect(emoji)}
                  sx={{
                    fontSize: '1.3rem',
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'action.hover',
                      transform: 'scale(1.2)',
                    },
                  }}
                >
                  {emoji}
                </IconButton>
              ))}
            </Box>
          </Box>
        </Popover>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
