import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

/**
 * Asset Repository
 * Handles all database operations for assets
 * Enhanced with full asset details including images, documents, timeline
 */
export class AssetRepository extends GenericRepository {
  constructor() {
    super(prisma.asset)
  }

  /**
   * Find asset by tag
   */
  async findByTag(tag) {
    return this.model.findUnique({
      where: { tag },
      include: {
        category: true,
        department: true,
        location: true,
        currentAssignee: true
      }
    })
  }

  /**
   * Find asset by asset number
   */
  async findByAssetNumber(assetNumber) {
    return this.model.findUnique({
      where: { assetNumber },
      include: {
        category: true,
        department: true,
        location: true,
        currentAssignee: true
      }
    })
  }

  /**
   * Find asset by serial number
   */
  async findBySerialNumber(serialNumber) {
    if (!serialNumber) return null
    return this.model.findUnique({
      where: { serialNumber },
      include: {
        category: true,
        department: true,
        location: true,
        currentAssignee: true
      }
    })
  }

  /**
   * Get full asset details including images, documents, timeline
   */
  async getAssetWithFullDetails(id) {
    return this.model.findUnique({
      where: { id },
      include: {
        category: true,
        department: true,
        location: true,
        currentAssignee: true,
        images: {
          where: { deletedAt: null },
          orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }]
        },
        documents: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' }
        },
        timeline: {
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    })
  }

  /**
   * Search and filter assets with pagination
   */
  async searchWithFilters(filters = {}) {
    const {
      search = null,
      categoryId = null,
      departmentId = null,
      locationId = null,
      status = null,
      condition = null,
      purchaseDateStart = null,
      purchaseDateEnd = null,
      warrantyExpiryStart = null,
      warrantyExpiryEnd = null,
      limit = 20,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { tag: { contains: search, mode: 'insensitive' } },
          { assetNumber: { contains: search, mode: 'insensitive' } },
          { serialNumber: { contains: search, mode: 'insensitive' } },
          { manufacturer: { contains: search, mode: 'insensitive' } },
          { model: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(categoryId && { categoryId }),
      ...(departmentId && { departmentId }),
      ...(locationId && { locationId }),
      ...(status && { status }),
      ...(condition && { condition }),
      ...(purchaseDateStart || purchaseDateEnd) && {
        purchaseDate: {
          ...(purchaseDateStart && { gte: new Date(purchaseDateStart) }),
          ...(purchaseDateEnd && { lte: new Date(purchaseDateEnd) })
        }
      },
      ...(warrantyExpiryStart || warrantyExpiryEnd) && {
        warrantyExpiry: {
          ...(warrantyExpiryStart && { gte: new Date(warrantyExpiryStart) }),
          ...(warrantyExpiryEnd && { lte: new Date(warrantyExpiryEnd) })
        }
      }
    }

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        include: {
          category: true,
          department: true,
          location: true,
          currentAssignee: true,
          images: {
            where: { deletedAt: null, isPrimary: true },
            take: 1
          }
        },
        skip: offset,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder.toLowerCase()
        }
      }),
      this.model.count({ where })
    ])

    return {
      data,
      total,
      count: data.length,
      offset,
      limit,
      hasMore: offset + data.length < total
    }
  }

  /**
   * Get assets by department
   */
  async findByDepartment(departmentId, options = {}) {
    const { limit = 50, offset = 0 } = options

    return this.model.findMany({
      where: { departmentId },
      include: {
        category: true,
        location: true,
        currentAssignee: true
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
  }

  /**
   * Get assets by status
   */
  async findByStatus(status, options = {}) {
    const { limit = 50, offset = 0 } = options

    return this.model.findMany({
      where: { status },
      include: {
        category: true,
        department: true,
        location: true
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
  }

  /**
   * Count assets by status
   */
  async countByStatus() {
    const statuses = ['AVAILABLE', 'ALLOCATED', 'MAINTENANCE', 'RETIRED', 'DISPOSED', 'RESERVED']
    const stats = {}

    for (const status of statuses) {
      stats[status] = await this.model.count({ where: { status } })
    }

    return stats
  }

  /**
   * Check if asset number exists
   */
  async assetNumberExists(assetNumber) {
    const asset = await this.model.findUnique({ where: { assetNumber } })
    return !!asset
  }

  /**
   * Check if asset tag exists
   */
  async assetTagExists(tag) {
    const asset = await this.model.findUnique({ where: { tag } })
    return !!asset
  }

  /**
   * Check if serial number exists
   */
  async serialNumberExists(serialNumber) {
    if (!serialNumber) return false
    const asset = await this.model.findUnique({ where: { serialNumber } })
    return !!asset
  }

  /**
   * Get assets with warranty expiry soon (within 30 days)
   */
  async findWarrantyExpiryWarning(days = 30) {
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + days)

    return this.model.findMany({
      where: {
        warrantyExpiry: {
          gte: startDate,
          lte: endDate
        },
        deletedAt: null
      },
      include: {
        category: true,
        department: true
      },
      orderBy: { warrantyExpiry: 'asc' }
    })
  }

  /**
   * Get asset statistics
   */
  async getStatistics() {
    const total = await this.model.count()
    const byStatus = await this.countByStatus()
    const byCategory = await this.model.groupBy({
      by: ['categoryId'],
      _count: true
    })

    return {
      total,
      byStatus,
      byCategory: byCategory.length,
      breakdown: byCategory
    }
  }
}

export default new AssetRepository()
