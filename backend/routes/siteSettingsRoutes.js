const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const auth = require('../middleware/auth');
const { cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (file.fieldname === 'photo') {
      return {
        folder: 'portfolio/images',
        allowed_formats: ['jpg', 'jpeg', 'png'],
      }
    } else {
      return {
        folder: 'portfolio/files',
        allowed_formats: ['pdf'],
        type: 'upload',
        access_mode: 'public',
      }
    }
  }
});

const upload = multer({ storage });
const uploadFields = upload.fields([
  { name: 'cvFile', maxCount: 1 },
  { name: 'photo', maxCount: 1 }
]);

// GET settings (public)
router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update settings (admin only)
router.put('/', auth, uploadFields, async (req, res) => {
  try {
    const { name, tagline, bio, github, linkedin, email, title, skills, status } = req.body;

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    settings.name = name || settings.name;
    settings.tagline = tagline || settings.tagline;
    settings.bio = bio || settings.bio;
    settings.github = github || settings.github;
    settings.linkedin = linkedin || settings.linkedin;
    settings.email = email || settings.email;
    settings.title = title || settings.title;
    settings.skills = skills ? skills.split(',').map(s => s.trim()) : settings.skills;
    settings.status = status || settings.status;

    if (req.files['cvFile']) {
      settings.cvFile = req.files['cvFile'][0].path;
    }

    if (req.files['photo']) {
      settings.photo = req.files['photo'][0].path;
    }

    await settings.save();
    res.json({ message: 'Settings saved successfully', settings });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;