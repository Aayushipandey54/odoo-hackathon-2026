import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import ApiResponse from '../utils/apiResponse.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// File filter for images
const imageFileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, WebP, GIF)'), false)
  }
}

// File filter for documents
const documentFileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only PDF, images, and Word documents are allowed'), false)
  }
}

// Image upload middleware (5MB max)
export const uploadImage = multer({
  storage: multer.memoryStorage(), // Store in memory for local processing
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
}).single('image')

// Document upload middleware (10MB max)
export const uploadDocument = multer({
  storage: multer.memoryStorage(),
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
}).single('document')

// Multiple uploads middleware
export const uploadMultiple = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
}).array('images', 10) // Max 10 images

// Error handling middleware for upload errors
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json(
        new ApiResponse(
          400,
          null,
          'File size exceeds maximum allowed',
          [{ field: 'file', message: 'File size too large' }]
        )
      )
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json(
        new ApiResponse(
          400,
          null,
          'Too many files uploaded',
          [{ field: 'files', message: 'Exceeded maximum file count' }]
        )
      )
    }
  }

  if (err && err.message) {
    return res.status(400).json(
      new ApiResponse(
        400,
        null,
        'File upload error',
        [{ field: 'file', message: err.message }]
      )
    )
  }

  next(err)
}
