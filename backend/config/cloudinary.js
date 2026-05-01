const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
})

const mixedStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (file.fieldname === 'screenshots') {
      return {
        folder: 'portfolio/images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      }
    } else if (file.fieldname === 'downloadFile') {
      return {
        folder: 'portfolio/files',
        resource_type: 'raw',
      }
    }
  }
})

const uploadImage = multer({ storage: imageStorage })
const uploadMixed = multer({ storage: mixedStorage })

module.exports = { cloudinary, uploadImage, uploadMixed }