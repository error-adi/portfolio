const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

// Storage configuration for cover images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// GET all published blogs (public)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all blogs including drafts (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single blog by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new blog (admin only)
router.post('/', auth, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, slug, content, excerpt, tags } = req.body;

    const coverImage = req.file ? req.file.filename : null;

    const blog = new Blog({
      title,
      slug,
      content,
      excerpt,
      tags: tags ? tags.split(',') : [],
      coverImage
    });

    await blog.save();
    res.json({ message: 'Blog post created successfully', blog });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update blog (admin only)
router.put('/:id', auth, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, slug, content, excerpt, tags, isPublished } = req.body;

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    blog.title = title || blog.title;
    blog.slug = slug || blog.slug;
    blog.content = content || blog.content;
    blog.excerpt = excerpt || blog.excerpt;
    blog.tags = tags ? tags.split(',') : blog.tags;
    blog.isPublished = isPublished !== undefined ? isPublished : blog.isPublished;

    if (req.file) {
      blog.coverImage = req.file.filename;
    }

    await blog.save();
    res.json({ message: 'Blog post updated successfully', blog });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE blog (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;