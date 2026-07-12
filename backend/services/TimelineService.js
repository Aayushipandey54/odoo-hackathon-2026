import { prisma } from '../core/connection.js'

/**
 * Timeline Service
 * Manages immutable asset timeline events
 * Creates audit trail of all asset lifecycle events
 */
export class TimelineService {
  /**
   * Create timeline event
   */
  async createTimelineEvent(assetId, event, description, details = null, performedBy = null) {
    try {
      const timelineEntry = await prisma.assetTimeline.create({
        data: {
          assetId,
          event,
          description,
          details: details ? JSON.stringify(details) : null,
          performedBy
        }
      })

      return timelineEntry
    } catch (error) {
      throw new Error(`Failed to create timeline event: ${error.message}`)
    }
  }

  /**
   * Get asset timeline
   */
  async getTimeline(assetId, options = {}) {
    try {
      const {
        limit = 50,
        offset = 0,
        orderBy = 'desc'
      } = options

      const timeline = await prisma.assetTimeline.findMany({
        where: { assetId },
        orderBy: {
          createdAt: orderBy === 'desc' ? 'desc' : 'asc'
        },
        skip: offset,
        take: limit
      })

      const total = await prisma.assetTimeline.count({
        where: { assetId }
      })

      return {
        data: this.formatTimeline(timeline),
        total,
        count: timeline.length,
        offset,
        limit
      }
    } catch (error) {
      throw new Error(`Failed to get timeline: ${error.message}`)
    }
  }

  /**
   * Get latest timeline event
   */
  async getLatestEvent(assetId) {
    try {
      const latest = await prisma.assetTimeline.findFirst({
        where: { assetId },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return latest ? this.formatTimeline([latest])[0] : null
    } catch (error) {
      throw new Error(`Failed to get latest timeline event: ${error.message}`)
    }
  }

  /**
   * Get timeline events by type
   */
  async getEventsByType(assetId, eventType) {
    try {
      const events = await prisma.assetTimeline.findMany({
        where: {
          assetId,
          event: eventType
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return this.formatTimeline(events)
    } catch (error) {
      throw new Error(`Failed to get events by type: ${error.message}`)
    }
  }

  /**
   * Format timeline for API response
   */
  formatTimeline(timeline) {
    return timeline.map(event => ({
      id: event.id,
      event: event.event,
      description: event.description,
      details: event.details ? JSON.parse(event.details) : null,
      performedBy: event.performedBy,
      createdAt: event.createdAt
    }))
  }

  /**
   * Common timeline event types
   */
  static EVENTS = {
    ASSET_REGISTERED: 'ASSET_REGISTERED',
    ASSET_UPDATED: 'ASSET_UPDATED',
    IMAGE_UPLOADED: 'IMAGE_UPLOADED',
    IMAGE_DELETED: 'IMAGE_DELETED',
    DOCUMENT_UPLOADED: 'DOCUMENT_UPLOADED',
    DOCUMENT_DELETED: 'DOCUMENT_DELETED',
    QR_CODE_GENERATED: 'QR_CODE_GENERATED',
    QR_CODE_REGENERATED: 'QR_CODE_REGENERATED',
    ASSET_ALLOCATED: 'ASSET_ALLOCATED',
    ASSET_RETURNED: 'ASSET_RETURNED',
    ASSET_TRANSFERRED: 'ASSET_TRANSFERRED',
    MAINTENANCE_STARTED: 'MAINTENANCE_STARTED',
    MAINTENANCE_COMPLETED: 'MAINTENANCE_COMPLETED',
    AUDIT_COMPLETED: 'AUDIT_COMPLETED'
  }
}

export default new TimelineService()
