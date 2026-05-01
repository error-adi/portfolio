const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  tagline: { type: String, default: '' },
  bio: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  email: { type: String, default: '' },
  cvFile: { type: String, default: '' },
  photo: { type: String, default: '' },
  title: { type: String, default: '' },
  skills: { type: [String], default: [] },
  status: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);