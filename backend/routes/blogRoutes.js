const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const { uploadImage } = require('../config/cloudinary');

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

    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new blog (admin only)
router.post('/', auth, uploadImage.single('coverImage'), async (req, res) => {
  try {
    const { title, slug, content, excerpt, tags } = req.body;

    const coverImage = req.file ? req.file.path : null;

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
router.put('/:id', auth, uploadImage.single('coverImage'), async (req, res) => {
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
      blog.coverImage = req.file.path;
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
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });
    res.json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;