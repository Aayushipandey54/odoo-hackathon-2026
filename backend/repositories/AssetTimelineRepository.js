import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

/**
 * Asset Timeline Repository
 * Handles database operations for asset timeline events
 */
export class AssetTimelineRepository extends GenericRepository {
  constructor() {
    super(prisma.assetTimeline)
  }

  /**
   * Find all timeline events for an asset
   */
  async findByAssetId(assetId, options = {}) {
    const {
      limit = 50,
      offset = 0,
      orderBy = 'desc'
    } = options

    const timeline = await this.model.findMany({
      where: { assetId },
      orderBy: {
        createdAt: orderBy === 'desc' ? 'desc' : 'asc'
      },
      skip: offset,
      take: limit
    })

    const total = await this.model.count({
      where: { assetId }
    })

    return {
      data: timeline,
      total,
      count: timeline.length,
      offset,
      limit
    }
  }

  /**
   * Get latest events for asset
   */
  async getLatestEvents(assetId, limit = 10) {
    return this.model.findMany({
      where: { assetId },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })
  }

  /**
   * Find events by type
   */
  async findByEvent(assetId, event) {
    return this.model.findMany({
      where: {
        assetId,
        event
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  /**
   * Get event count for asset
   */
  async countByAssetId(assetId) {
    return this.model.count({
      where: { assetId }
    })
  }

  /**
   * Get timeline events within date range
   */
  async findByDateRange(assetId, startDate, endDate) {
    return this.model.findMany({
      where: {
        assetId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  /**
   * Get timeline with pagination and filtering
   */
  async findWithFilters(assetId, filters = {}) {
    const {
      limit = 50,
      offset = 0,
      eventType = null,
      startDate = null,
      endDate = null
    } = filters

    const where = {
      assetId,
      ...(eventType && { event: eventType }),
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    }

    const timeline = await this.model.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    })

    const total = await this.model.count({ where })

    return {
      data: timeline,
      total,
      count: timeline.length,
      offset,
      limit
    }
  }

  /**
   * Get activity statistics
   */
  async getActivityStats(assetId) {
    const timeline = await this.model.findMany({
      where: { assetId }
    })

    const stats = {}
    timeline.forEach(event => {
      stats[event.event] = (stats[event.event] || 0) + 1
    })

    return {
      totalEvents: timeline.length,
      eventBreakdown: stats,
      firstEvent: timeline.length > 0 ? timeline[timeline.length - 1] : null,
      lastEvent: timeline.length > 0 ? timeline[0] : null
    }
  }

  /**
   * Delete timeline event by ID
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
        throw new Error('Timeline event not found')
      }
      throw error
    }
  }
}

export default new AssetTimelineRepository()
