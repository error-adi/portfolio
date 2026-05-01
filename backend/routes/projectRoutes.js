const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Storage configuration for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// GET all published projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all projects including drafts (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single project by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new project (admin only)
router.post('/', auth, upload.fields([
  { name: 'downloadFile', maxCount: 1 },
  { name: 'screenshots', maxCount: 5 }
]), async (req, res) => {
  try {
    const { title, slug, description, longDescription, techStack } = req.body;

    const downloadFile = req.files['downloadFile']
      ? req.files['downloadFile'][0].filename
      : null;

    const screenshots = req.files['screenshots']
      ? req.files['screenshots'].map(f => f.filename)
      : [];

    const project = new Project({
      title,
      slug,
      description,
      longDescription,
      techStack: techStack ? techStack.split(',') : [],
      downloadFile,
      screenshots
    });

    await project.save();
    res.json({ message: 'Project created successfully', project });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update project (admin only)
router.put('/:id', auth, upload.fields([
  { name: 'downloadFile', maxCount: 1 },
  { name: 'screenshots', maxCount: 5 }
]), async (req, res) => {
  try {
    const { title, slug, description, longDescription, techStack, isPublished } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.title = title || project.title;
    project.slug = slug || project.slug;
    project.description = description || project.description;
    project.longDescription = longDescription || project.longDescription;
    project.techStack = techStack ? techStack.split(',') : project.techStack;
    project.isPublished = isPublished !== undefined ? isPublished : project.isPublished;

    if (req.files['downloadFile']) {
      project.downloadFile = req.files['downloadFile'][0].filename;
    }

    if (req.files['screenshots']) {
      project.screenshots = req.files['screenshots'].map(f => f.filename);
    }

    await project.save();
    res.json({ message: 'Project updated successfully', project });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH increment download count (public)
router.patch('/:id/download', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    res.json({ downloadCount: project.downloadCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE project (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;