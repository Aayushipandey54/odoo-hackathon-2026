import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import AssetService from '../services/AssetService.js'

/**
 * Asset Controller
 * Handles all asset-related HTTP requests
 * All business logic delegated to AssetService
 */

// ===== READ OPERATIONS =====

/**
 * Get all assets with pagination and filters
 * GET /assets
 */
export const getAllAssets = asyncHandler(async (req, res) => {
  const { search, categoryId, departmentId, locationId, status, condition, sortBy, sortOrder, limit, offset } = req.query

  // Validate and sanitize pagination parameters
  const validLimit = Math.max(1, Math.min(parseInt(limit) || 20, 1000))
  const validOffset = Math.max(0, parseInt(offset) || 0)

  const filters = {
    search: search || null,
    categoryId: categoryId || null,
    departmentId: departmentId || null,
    locationId: locationId || null,
    status: status || null,
    condition: condition || null,
    limit: validLimit,
    offset: validOffset,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc'
  }

  const result = await AssetService.getAll(filters)
  res.status(200).json(new ApiResponse(200, result, 'Assets retrieved successfully'))
})

/**
 * Get asset by ID
 * GET /assets/:id
 */
export const getAssetById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const asset = await AssetService.getById(id)
  res.status(200).json(new ApiResponse(200, asset, 'Asset retrieved successfully'))
})

/**
 * Search assets with advanced filters
 * GET /assets/search
 */
export const searchAssets = asyncHandler(async (req, res) => {
  // Validate and sanitize pagination parameters
  const validLimit = Math.max(1, Math.min(parseInt(req.query.limit) || 20, 1000))
  const validOffset = Math.max(0, parseInt(req.query.offset) || 0)

  const filters = {
    search: req.query.search || null,
    categoryId: req.query.categoryId || null,
    departmentId: req.query.departmentId || null,
    locationId: req.query.locationId || null,
    status: req.query.status || null,
    condition: req.query.condition || null,
    purchaseDateStart: req.query.purchaseDateStart || null,
    purchaseDateEnd: req.query.purchaseDateEnd || null,
    warrantyExpiryStart: req.query.warrantyExpiryStart || null,
    warrantyExpiryEnd: req.query.warrantyExpiryEnd || null,
    limit: validLimit,
    offset: validOffset,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc'
  }

  const result = await AssetService.search(filters)
  res.status(200).json(new ApiResponse(200, result, 'Search results retrieved successfully'))
})

/**
 * Get asset timeline
 * GET /assets/:id/timeline
 */
export const getAssetTimeline = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { limit = 50, offset = 0 } = req.query

  // Validate and sanitize pagination parameters
  const validLimit = Math.max(1, Math.min(parseInt(limit) || 50, 1000))
  const validOffset = Math.max(0, parseInt(offset) || 0)

  const timeline = await AssetService.getTimeline(id, {
    limit: validLimit,
    offset: validOffset
  })

  res.status(200).json(new ApiResponse(200, timeline, 'Timeline retrieved successfully'))
})

/**
 * Get asset QR code
 * GET /assets/:id/qrcode
 */
export const getAssetQRCode = asyncHandler(async (req, res) => {
  const { id } = req.params
  const qrCode = await AssetService.getQRCode(id)
  res.status(200).json(new ApiResponse(200, qrCode, 'QR code retrieved successfully'))
})

/**
 * Get asset statistics
 * GET /assets/stats
 */
export const getAssetStatistics = asyncHandler(async (req, res) => {
  const stats = await AssetService.getStatistics()
  res.status(200).json(new ApiResponse(200, stats, 'Statistics retrieved successfully'))
})

// ===== CREATE OPERATIONS =====

/**
 * Create new asset
 * POST /assets
 */
export const createAsset = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const asset = await AssetService.create(req.body, userId)
  res.status(201).json(new ApiResponse(201, asset, 'Asset registered successfully'))
})

// ===== UPDATE OPERATIONS =====

/**
 * Update asset
 * PUT /assets/:id
 */
export const updateAsset = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user?.id || 'system'
  const asset = await AssetService.update(id, req.body, userId)
  res.status(200).json(new ApiResponse(200, asset, 'Asset updated successfully'))
})

/**
 * Regenerate QR code
 * POST /assets/:id/qrcode/regenerate
 */
export const regenerateAssetQRCode = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user?.id || 'system'
  const result = await AssetService.regenerateQRCode(id, userId)
  res.status(200).json(new ApiResponse(200, result, 'QR code regenerated successfully'))
})

// ===== DELETE OPERATIONS =====

/**
 * Delete asset (soft delete)
 * DELETE /assets/:id
 */
export const deleteAsset = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user?.id || 'system'
  const result = await AssetService.delete(id, userId)
  res.status(200).json(new ApiResponse(200, result, 'Asset deleted successfully'))
})

// ===== FILE OPERATIONS =====

/**
 * Upload asset image
 * POST /assets/:id/images
 */
export const uploadAssetImage = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user?.id || 'system'

  if (!req.file) {
    return res.status(400).json(new ApiResponse(400, null, 'No image file provided'))
  }

  const isPrimary = req.body.isPrimary === 'true' || req.body.isPrimary === true
  const image = await AssetService.uploadImage(id, req.file, isPrimary, userId)

  res.status(201).json(new ApiResponse(201, image, 'Image uploaded successfully'))
})

/**
 * Delete asset image
 * DELETE /assets/:id/images/:imageId
 */
export const deleteAssetImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params
  const userId = req.user?.id || 'system'
  const result = await AssetService.deleteImage(id, imageId, userId)
  res.status(200).json(new ApiResponse(200, result, 'Image deleted successfully'))
})

/**
 * Upload asset document
 * POST /assets/:id/documents
 */
export const uploadAssetDocument = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user?.id || 'system'

  if (!req.file) {
    return res.status(400).json(new ApiResponse(400, null, 'No document file provided'))
  }

  const documentType = req.body.documentType || 'OTHER'
  const document = await AssetService.uploadDocument(id, req.file, documentType, userId)

  res.status(201).json(new ApiResponse(201, document, 'Document uploaded successfully'))
})

/**
 * Delete asset document
 * DELETE /assets/:id/documents/:docId
 */
export const deleteAssetDocument = asyncHandler(async (req, res) => {
  const { id, docId } = req.params
  const userId = req.user?.id || 'system'
  const result = await AssetService.deleteDocument(id, docId, userId)
  res.status(200).json(new ApiResponse(200, result, 'Document deleted successfully'))
})
