import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * File Storage Service
 * Abstracts file storage operations (currently local, can be extended to Cloudinary/ImageKit)
 * Supports images and documents for assets
 */
export class FileStorageService {
  constructor() {
    this.uploadsDir = path.join(__dirname, '../uploads')
    this.imagesDir = path.join(this.uploadsDir, 'images')
    this.documentsDir = path.join(this.uploadsDir, 'documents')
    this.maxImageSize = 5 * 1024 * 1024 // 5MB
    this.maxDocumentSize = 10 * 1024 * 1024 // 10MB
    this.allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    this.allowedDocumentTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }

  /**
   * Initialize upload directories
   */
  async initializeDirectories() {
    try {
      await fs.mkdir(this.imagesDir, { recursive: true })
      await fs.mkdir(this.documentsDir, { recursive: true })
    } catch (error) {
      console.error('Error creating upload directories:', error)
    }
  }

  /**
   * Validate file
   */
  validateFile(file, allowedTypes, maxSize) {
    const errors = []

    if (!file) {
      errors.push('File is required')
      return { valid: false, errors }
    }

    if (!allowedTypes.includes(file.mimetype)) {
      errors.push(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`)
    }

    if (file.size > maxSize) {
      errors.push(`File size exceeds maximum allowed (${maxSize / 1024 / 1024}MB)`)
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Upload image
   * Returns object with file metadata
   */
  async uploadImage(file, assetId) {
    try {
      // Validate file
      const validation = this.validateFile(file, this.allowedImageTypes, this.maxImageSize)
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '))
      }

      await this.initializeDirectories()

      // Generate unique filename
      const timestamp = Date.now()
      const ext = path.extname(file.originalname)
      const filename = `${assetId}-${timestamp}${ext}`
      const filepath = path.join(this.imagesDir, filename)

      // Save file
      await fs.writeFile(filepath, file.buffer)

      return {
        url: `/uploads/images/${filename}`,
        filename: file.originalname,
        storedFilename: filename,
        mimeType: file.mimetype,
        size: file.size
      }
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`)
    }
  }

  /**
   * Upload document
   * Returns object with file metadata
   */
  async uploadDocument(file, assetId) {
    try {
      // Validate file
      const validation = this.validateFile(file, this.allowedDocumentTypes, this.maxDocumentSize)
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '))
      }

      await this.initializeDirectories()

      // Generate unique filename
      const timestamp = Date.now()
      const ext = path.extname(file.originalname)
      const filename = `${assetId}-${timestamp}${ext}`
      const filepath = path.join(this.documentsDir, filename)

      // Save file
      await fs.writeFile(filepath, file.buffer)

      return {
        url: `/uploads/documents/${filename}`,
        filename: file.originalname,
        storedFilename: filename,
        mimeType: file.mimetype,
        size: file.size
      }
    } catch (error) {
      throw new Error(`Failed to upload document: ${error.message}`)
    }
  }

  /**
   * Delete file
   * Validates filename format and path to prevent directory traversal attacks
   */
  async deleteFile(url) {
    try {
      // Extract filename from URL
      const parts = url.split('/')
      const filename = parts[parts.length - 1]
      const type = parts[parts.length - 2] // 'images' or 'documents'

      // Validate filename format (alphanumeric, dash, underscore, dot only)
      const filenamePattern = /^[a-zA-Z0-9\-_\.]+$/
      if (!filenamePattern.test(filename)) {
        throw new Error('Invalid filename format')
      }

      // Prevent path traversal attempts (reject .. and absolute paths)
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        throw new Error('Invalid filename: path traversal detected')
      }

      const dir = type === 'images' ? this.imagesDir : this.documentsDir
      const filepath = path.join(dir, filename)

      // Verify resolved path stays within allowed directory
      const resolvedPath = path.resolve(filepath)
      const resolvedDir = path.resolve(dir)
      
      if (!resolvedPath.startsWith(resolvedDir)) {
        throw new Error('Invalid file path: access denied')
      }

      await fs.unlink(filepath)
      return true
    } catch (error) {
      console.warn(`File operation error: ${error.message}`)
      return false
    }
  }

  /**
   * Get file size in human readable format
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }
}

export default new FileStorageService()
