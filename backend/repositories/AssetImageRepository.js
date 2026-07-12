import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

/**
 * Asset Image Repository
 * Handles database operations for asset images
 */
export class AssetImageRepository extends GenericRepository {
  constructor() {
    super(prisma.assetImage)
  }

  /**
   * Find all images for an asset
   */
  async findByAssetId(assetId) {
    return this.model.findMany({
      where: { assetId },
      orderBy: {
        createdAt: 'asc'
      }
    })
  }

  /**
   * Get primary image for asset
   */
  async getPrimaryImage(assetId) {
    return this.model.findFirst({
      where: {
        assetId,
        isPrimary: true
      }
    })
  }

  /**
   * Set image as primary for asset
   * Unsets all other images as primary
   */
  async setPrimaryImage(assetId, imageId) {
    // Unset all other images
    await this.model.updateMany({
      where: {
        assetId,
        id: { not: imageId }
      },
      data: { isPrimary: false }
    })

    // Set this image as primary
    return this.model.update({
      where: { id: imageId },
      data: { isPrimary: true }
    })
  }

  /**
   * Get image count for asset
   */
  async countByAssetId(assetId) {
    return this.model.count({
      where: { assetId }
    })
  }

  /**
   * Delete image by ID
   * Soft delete by setting deletedAt timestamp
   */
  async deleteById(id) {
    try {
      return await this.model.update({
        where: { id },
        data: { deletedAt: new Date() }
      })
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Image not found')
      }
      throw error
    }
  }

  /**
   * Get non-deleted images
   */
  async findActiveByAssetId(assetId) {
    return this.model.findMany({
      where: {
        assetId,
        deletedAt: null
      },
      orderBy: {
        isPrimary: 'desc',
        createdAt: 'asc'
      }
    })
  }
}

export default new AssetImageRepository()
