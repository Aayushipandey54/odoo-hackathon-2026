import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

/**
 * Asset Document Repository
 * Handles database operations for asset documents
 */
export class AssetDocumentRepository extends GenericRepository {
  constructor() {
    super(prisma.assetDocument)
  }

  /**
   * Find all documents for an asset
   */
  async findByAssetId(assetId) {
    return this.model.findMany({
      where: { assetId },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  /**
   * Find documents by type
   */
  async findByType(assetId, documentType) {
    return this.model.findMany({
      where: {
        assetId,
        documentType
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  /**
   * Get document count for asset
   */
  async countByAssetId(assetId) {
    return this.model.count({
      where: { assetId }
    })
  }

  /**
   * Delete document by ID
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
        throw new Error('Document not found')
      }
      throw error
    }
  }

  /**
   * Get non-deleted documents
   */
  async findActiveByAssetId(assetId) {
    return this.model.findMany({
      where: {
        assetId,
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  /**
   * Count documents by type
   */
  async countByType(assetId, documentType) {
    return this.model.count({
      where: {
        assetId,
        documentType
      }
    })
  }

  /**
   * Get all document types for asset
   */
  async getDocumentTypes(assetId) {
    const docs = await this.model.findMany({
      where: { assetId },
      distinct: ['documentType'],
      select: { documentType: true }
    })

    return docs.map(d => d.documentType)
  }
}

export default new AssetDocumentRepository()
