import { Router } from 'express'
import {
  getAllAssets,
  createAsset,
  getAssetById,
  updateAsset,
  deleteAsset,
  searchAssets,
  getAssetTimeline,
  getAssetQRCode,
  regenerateAssetQRCode,
  uploadAssetImage,
  deleteAssetImage,
  uploadAssetDocument,
  deleteAssetDocument,
  getAssetStatistics
} from '../controllers/assetController.js'
import { uploadImage, uploadDocument, handleUploadError } from '../middleware/upload.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// ===== READ OPERATIONS =====
router.get('/stats', authenticate, getAssetStatistics)
router.get('/search', authenticate, searchAssets) // Must be before /:id
router.get('/:id/timeline', authenticate, getAssetTimeline)
router.get('/:id/qrcode', authenticate, getAssetQRCode)
router.get('/:id', authenticate, getAssetById)
router.get('/', authenticate, getAllAssets)

// ===== CREATE OPERATIONS =====
router.post('/', authenticate, createAsset)

// ===== UPDATE OPERATIONS =====
router.put('/:id', authenticate, updateAsset)
router.post('/:id/qrcode/regenerate', authenticate, regenerateAssetQRCode)

// ===== DELETE OPERATIONS =====
router.delete('/:id', authenticate, deleteAsset)

// ===== FILE OPERATIONS =====
// Images
router.post('/:id/images', authenticate, uploadImage, handleUploadError, uploadAssetImage)
router.delete('/:id/images/:imageId', authenticate, deleteAssetImage)

// Documents
router.post('/:id/documents', authenticate, uploadDocument, handleUploadError, uploadAssetDocument)
router.delete('/:id/documents/:docId', authenticate, deleteAssetDocument)

export default router
