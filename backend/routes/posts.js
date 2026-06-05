const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// POST /api/posts - Create a new post (protected)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;

    // At least one of text or image must be provided
    if (!text && !req.file) {
      return res
        .status(400)
        .json({ message: 'Please provide text, an image, or both' });
    }

    const postData = {
      user: req.user._id,
      username: req.user.username,
      text: text || '',
    };

    // Add image path if uploaded
    if (req.file) {
      postData.image = '/uploads/' + req.file.filename;
    }

    const post = await Post.create(postData);

    // Populate the post with full user details
    const populatedPost = await Post.findById(post._id)
      .populate('user', 'username email')
      .populate('likes.user', 'username')
      .populate('comments.user', 'username');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Create post error:', error.message);
    if (error.message.includes('Only image files')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while creating post' });
  }
});

// GET /api/posts - Get all posts (public feed)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .populate('user', 'username email')
      .populate('likes.user', 'username')
      .populate('comments.user', 'username');

    const total = await Post.countDocuments();

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get posts error:', error.message);
    res.status(500).json({ message: 'Server error while fetching posts' });
  }
});

// GET /api/posts/:id - Get a single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username email')
      .populate('likes.user', 'username')
      .populate('comments.user', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error.message);
    res.status(500).json({ message: 'Server error while fetching post' });
  }
});

// PUT /api/posts/:id/like - Toggle like on a post (protected)
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already liked the post
    const likeIndex = post.likes.findIndex(
      (like) => like.user.toString() === req.user._id.toString()
    );

    if (likeIndex > -1) {
      // Unlike: remove the like
      post.likes.splice(likeIndex, 1);
    } else {
      // Like: add the like with username
      post.likes.push({
        user: req.user._id,
        username: req.user.username,
      });
    }

    await post.save();

    // Return updated post populated
    const updatedPost = await Post.findById(post._id)
      .populate('user', 'username email')
      .populate('likes.user', 'username')
      .populate('comments.user', 'username');

    res.json(updatedPost);
  } catch (error) {
    console.error('Like error:', error.message);
    res.status(500).json({ message: 'Server error while updating like' });
  }
});

// POST /api/posts/:id/comment - Add a comment to a post (protected)
router.post(
  '/:id/comment',
  protect,
  [body('text').trim().notEmpty().withMessage('Comment text is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      post.comments.push({
        user: req.user._id,
        username: req.user.username,
        text: req.body.text,
      });

      await post.save();

      // Return updated post populated
      const updatedPost = await Post.findById(post._id)
        .populate('user', 'username email')
        .populate('likes.user', 'username')
        .populate('comments.user', 'username');

      res.status(201).json(updatedPost);
    } catch (error) {
      console.error('Comment error:', error.message);
      res.status(500).json({ message: 'Server error while adding comment' });
    }
  }
);

// DELETE /api/posts/:id - Delete a post (only by post owner)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error.message);
    res.status(500).json({ message: 'Server error while deleting post' });
  }
});

module.exports = router;
