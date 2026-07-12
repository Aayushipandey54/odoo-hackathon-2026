import AssetRepository from '../repositories/AssetRepository.js'
import AssetImageRepository from '../repositories/AssetImageRepository.js'
import AssetDocumentRepository from '../repositories/AssetDocumentRepository.js'
import ActivityLogRepository from '../repositories/ActivityLogRepository.js'
import AssetNumberService from './AssetNumberService.js'
import QRCodeService from './QRCodeService.js'
import FileStorageService from './FileStorageService.js'
import TimelineService from './TimelineService.js'

/**
 * Asset Service
 * Core business logic for asset management
 * Handles registration, updates, uploads, and lifecycle events
 */
export class AssetService {
  /**
   * Get all assets with basic info
   */
  async getAll(filters = {}) {
    return AssetRepository.searchWithFilters({
      ...filters,
      limit: filters.limit || 20,
      offset: filters.offset || 0
    })
  }

  /**
   * Create new asset
   * - Generates unique asset number
   * - Creates asset first
   * - Generates QR code with actual asset ID
   * - Creates timeline event
   * - Logs activity
   */
  async create(data, userId) {
    try {
      // Generate asset number
      const assetNumber = await AssetNumberService.generateAssetNumber()

      // Verify unique constraints
      const tagExists = await AssetRepository.assetTagExists(data.tag)
      if (tagExists) {
        throw new Error('Asset tag already exists')
      }

      if (data.serialNumber) {
        const serialExists = await AssetRepository.serialNumberExists(data.serialNumber)
        if (serialExists) {
          throw new Error('Asset serial number already exists')
        }
      }

      // Create asset first (without QR code)
      const asset = await AssetRepository.create({
        ...data,
        assetNumber,
        status: 'AVAILABLE',
        condition: data.condition || 'NEW'
      })

      // Generate QR code with actual asset ID
      const qrCodeUrl = await QRCodeService.generateQRCode(asset.id, asset.assetNumber)
      await AssetRepository.update(asset.id, { qrCode: qrCodeUrl })

      // Create timeline event
      await TimelineService.createTimelineEvent(
        asset.id,
        TimelineService.EVENTS.ASSET_REGISTERED,
        `Asset ${asset.assetNumber} (${asset.tag}) registered`,
        { assetNumber: asset.assetNumber, tag: asset.tag },
        userId
      )

      // Log activity
      await ActivityLogRepository.create({
        action: 'ASSET_REGISTERED',
        details: `Asset ${asset.assetNumber} registered with tag ${asset.tag}`,
        entityId: asset.id,
        entityType: 'ASSET',
        userId
      })

      return this.getById(asset.id)
    } catch (error) {
      throw new Error(`Failed to create asset: ${error.message}`)
    }
  }

  /**
   * Get asset by ID with full details
   */
  async getById(id) {
    const asset = await AssetRepository.getAssetWithFullDetails(id)
    if (!asset) {
      throw new Error('Asset not found')
    }
    return asset
  }

  /**
   * Update asset
   * Tracks field changes and creates timeline events
   */
  async update(id, data, userId) {
    try {
      const existing = await AssetRepository.findById(id)
      if (!existing) {
        throw new Error('Asset not found')
      }

      // Check for duplicate tag if being changed
      if (data.tag && data.tag !== existing.tag) {
        const tagExists = await AssetRepository.assetTagExists(data.tag)
        if (tagExists) {
          throw new Error('Asset tag already exists')
        }
      }

      // Check for duplicate serial number if being changed
      if (data.serialNumber && data.serialNumber !== existing.serialNumber) {
        const serialExists = await AssetRepository.serialNumberExists(data.serialNumber)
        if (serialExists) {
          throw new Error('Asset serial number already exists')
        }
      }

      // Track changed fields for timeline
      const changes = {}
      Object.keys(data).forEach(key => {
        if (existing[key] !== data[key]) {
          changes[key] = {
            from: existing[key],
            to: data[key]
          }
        }
      })

      // Update asset
      const updated = await AssetRepository.update(id, data)

      // Create timeline event if changes exist
      if (Object.keys(changes).length > 0) {
        await TimelineService.createTimelineEvent(
          id,
          TimelineService.EVENTS.ASSET_UPDATED,
          `Asset ${existing.assetNumber} updated`,
          changes,
          userId
        )
      }

      // Log activity
      await ActivityLogRepository.create({
        action: 'ASSET_UPDATED',
        details: `Asset ${existing.assetNumber} updated`,
        entityId: id,
        entityType: 'ASSET',
        userId
      })

      return this.getById(id)
    } catch (error) {
      throw new Error(`Failed to update asset: ${error.message}`)
    }
  }

  /**
   * Delete asset (soft delete)
   */
  async delete(id, userId) {
    try {
      const existing = await AssetRepository.findById(id)
      if (!existing) {
        throw new Error('Asset not found')
      }

      await AssetRepository.update(id, { deletedAt: new Date() })

      await ActivityLogRepository.create({
        action: 'ASSET_DELETED',
        details: `Asset ${existing.assetNumber} deleted`,
        entityId: id,
        entityType: 'ASSET',
        userId
      })

      return { success: true, message: 'Asset deleted successfully' }
    } catch (error) {
      throw new Error(`Failed to delete asset: ${error.message}`)
    }
  }

  /**
   * Search assets with filters
   */
  async search(filters) {
    return AssetRepository.searchWithFilters(filters)
  }

  /**
   * Upload asset image
   */
  async uploadImage(assetId, file, isPrimary = false, userId) {
    try {
      const asset = await AssetRepository.findById(assetId)
      if (!asset) {
        throw new Error('Asset not found')
      }

      // Upload file
      const fileData = await FileStorageService.uploadImage(file, assetId)

      // Save to database
      const image = await AssetImageRepository.create({
        assetId,
        url: fileData.url,
        filename: fileData.filename,
        mimeType: fileData.mimeType,
        size: fileData.size,
        isPrimary: isPrimary || (await AssetImageRepository.countByAssetId(assetId)) === 0
      })

      // Create timeline event
      await TimelineService.createTimelineEvent(
        assetId,
        TimelineService.EVENTS.IMAGE_UPLOADED,
        `Image uploaded: ${fileData.filename}`,
        { filename: fileData.filename, size: fileData.size },
        userId
      )

      // Log activity
      await ActivityLogRepository.create({
        action: 'ASSET_IMAGE_UPLOADED',
        details: `Image uploaded for asset ${asset.assetNumber}`,
        entityId: assetId,
        entityType: 'ASSET',
        userId
      })

      return image
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`)
    }
  }

  /**
   * Upload asset document
   */
  async uploadDocument(assetId, file, documentType = 'OTHER', userId) {
    try {
      const asset = await AssetRepository.findById(assetId)
      if (!asset) {
        throw new Error('Asset not found')
      }

      // Upload file
      const fileData = await FileStorageService.uploadDocument(file, assetId)

      // Save to database
      const document = await AssetDocumentRepository.create({
        assetId,
        url: fileData.url,
        filename: fileData.filename,
        mimeType: fileData.mimeType,
        size: fileData.size,
        documentType
      })

      // Create timeline event
      await TimelineService.createTimelineEvent(
        assetId,
        TimelineService.EVENTS.DOCUMENT_UPLOADED,
        `Document uploaded: ${fileData.filename}`,
        { filename: fileData.filename, type: documentType, size: fileData.size },
        userId
      )

      // Log activity
      await ActivityLogRepository.create({
        action: 'ASSET_DOCUMENT_UPLOADED',
        details: `${documentType} document uploaded for asset ${asset.assetNumber}`,
        entityId: assetId,
        entityType: 'ASSET',
        userId
      })

      return document
    } catch (error) {
      throw new Error(`Failed to upload document: ${error.message}`)
    }
  }

  /**
   * Delete image
   */
  async deleteImage(assetId, imageId, userId) {
    try {
      const asset = await AssetRepository.findById(assetId)
      if (!asset) {
        throw new Error('Asset not found')
      }

      const image = await AssetImageRepository.findById(imageId)
      if (!image || image.assetId !== assetId) {
        throw new Error('Image not found')
      }

      // Delete file from storage
      await FileStorageService.deleteFile(image.url)

      // Mark as deleted
      await AssetImageRepository.deleteById(imageId)

      // Create timeline event
      await TimelineService.createTimelineEvent(
        assetId,
        TimelineService.EVENTS.IMAGE_DELETED,
        `Image deleted: ${image.filename}`,
        { filename: image.filename },
        userId
      )

      // Log activity
      await ActivityLogRepository.create({
        action: 'ASSET_IMAGE_DELETED',
        details: `Image deleted for asset ${asset.assetNumber}`,
        entityId: assetId,
        entityType: 'ASSET',
        userId
      })

      return { success: true, message: 'Image deleted successfully' }
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`)
    }
  }

  /**
   * Delete document
   */
  async deleteDocument(assetId, docId, userId) {
    try {
      const asset = await AssetRepository.findById(assetId)
      if (!asset) {
        throw new Error('Asset not found')
      }

      const document = await AssetDocumentRepository.findById(docId)
      if (!document || document.assetId !== assetId) {
        throw new Error('Document not found')
      }

      // Delete file from storage
      await FileStorageService.deleteFile(document.url)

      // Mark as deleted
      await AssetDocumentRepository.deleteById(docId)

      // Create timeline event
      await TimelineService.createTimelineEvent(
        assetId,
        TimelineService.EVENTS.DOCUMENT_DELETED,
        `Document deleted: ${document.filename}`,
        { filename: document.filename, type: document.documentType },
        userId
      )

      // Log activity
      await ActivityLogRepository.create({
        action: 'ASSET_DOCUMENT_DELETED',
        details: `Document deleted for asset ${asset.assetNumber}`,
        entityId: assetId,
        entityType: 'ASSET',
        userId
      })

      return { success: true, message: 'Document deleted successfully' }
    } catch (error) {
      throw new Error(`Failed to delete document: ${error.message}`)
    }
  }

  /**
   * Get asset QR code
   */
  async getQRCode(assetId) {
    try {
      const asset = await AssetRepository.findById(assetId)
      if (!asset) {
        throw new Error('Asset not found')
      }

      if (!asset.qrCode) {
        throw new Error('QR code not generated for this asset')
      }

      return {
        assetId: asset.id,
        assetNumber: asset.assetNumber,
        tag: asset.tag,
        qrCode: asset.qrCode
      }
    } catch (error) {
      throw new Error(`Failed to get QR code: ${error.message}`)
    }
  }

  /**
   * Regenerate asset QR code
   */
  async regenerateQRCode(assetId, userId) {
    try {
      const asset = await AssetRepository.findById(assetId)
      if (!asset) {
        throw new Error('Asset not found')
      }

      // Generate new QR code (returns file URL, not base64)
      const newQRCodeUrl = await QRCodeService.generateQRCode(asset.id, asset.assetNumber)

      // Update asset
      await AssetRepository.update(assetId, { qrCode: newQRCodeUrl })

      // Create timeline event
      await TimelineService.createTimelineEvent(
        assetId,
        TimelineService.EVENTS.QR_CODE_REGENERATED,
        `QR code regenerated for asset ${asset.assetNumber}`,
        {},
        userId
      )

      // Log activity
      await ActivityLogRepository.create({
        action: 'ASSET_QR_REGENERATED',
        details: `QR code regenerated for asset ${asset.assetNumber}`,
        entityId: assetId,
        entityType: 'ASSET',
        userId
      })

      return {
        assetId,
        assetNumber: asset.assetNumber,
        qrCode: newQRCodeUrl
      }
    } catch (error) {
      throw new Error(`Failed to regenerate QR code: ${error.message}`)
    }
  }

  /**
   * Get asset timeline
   */
  async getTimeline(assetId, options = {}) {
    try {
      const asset = await AssetRepository.findById(assetId)
      if (!asset) {
        throw new Error('Asset not found')
      }

      const timeline = await TimelineService.getTimeline(assetId, options)
      return timeline
    } catch (error) {
      throw new Error(`Failed to get timeline: ${error.message}`)
    }
  }

  /**
   * Get asset statistics
   */
  async getStatistics() {
    return AssetRepository.getStatistics()
  }
}

export default new AssetService()
