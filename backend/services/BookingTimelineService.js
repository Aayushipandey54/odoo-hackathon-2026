/**
 * Booking Timeline Service
 * Records immutable booking lifecycle events
 * Tracks status changes, approvals, cancellations
 */

import { prisma } from '../core/connection.js'
import { ValidationError, NotFoundError } from '../utils/errors.js'

// Timeline event types
export const BOOKING_TIMELINE_EVENTS = {
  CREATED: 'BOOKING_CREATED',
  CONFIRMED: 'BOOKING_CONFIRMED',
  APPROVED: 'BOOKING_APPROVED',
  REJECTED: 'BOOKING_REJECTED',
  CANCELLED: 'BOOKING_CANCELLED',
  COMPLETED: 'BOOKING_COMPLETED',
  MODIFIED: 'BOOKING_MODIFIED'
}

export class BookingTimelineService {
  /**
   * Create timeline event for booking
   * @param {string} bookingId - Booking ID
   * @param {string} eventType - Type of event (from BOOKING_TIMELINE_EVENTS)
   * @param {string} description - Event description
   * @param {string} userId - User who triggered event
   * @param {Object} details - Additional event details
   * @returns {Promise<Object>} - Created timeline event
   */
  async createEvent(bookingId, eventType, description, userId, details = {}) {
    if (!bookingId) {
      throw new ValidationError('bookingId is required')
    }

    if (!eventType) {
      throw new ValidationError('eventType is required')
    }

    if (!description) {
      throw new ValidationError('description is required')
    }

    // Verify booking exists
    const booking = await prisma.resourceBooking.findUnique({
      where: { id: bookingId }
    })

    if (!booking) {
      throw new ValidationError(`Booking ${bookingId} not found`)
    }

    // Create timeline event as activity log entry
    const event = await prisma.activityLog.create({
      data: {
        action: eventType,
        description,
        details: {
          bookingId,
          ...details
        },
        entityId: bookingId,
        entityType: 'BOOKING',
        userId: userId || 'system',
        createdAt: new Date()
      }
    })

    return event
  }

  /**
   * Get complete booking timeline
   * @param {string} bookingId - Booking ID
   * @returns {Promise<Array>} - Timeline events ordered chronologically
   */
  async getBookingTimeline(bookingId) {
    if (!bookingId) {
      throw new ValidationError('bookingId is required')
    }

    const events = await prisma.activityLog.findMany({
      where: {
        entityId: bookingId,
        entityType: 'BOOKING'
      },
      orderBy: { createdAt: 'asc' }
    })

    return events.map(e => ({
      id: e.id,
      event: e.action,
      description: e.description,
      performedBy: e.userId,
      timestamp: e.createdAt,
      details: e.details
    }))
  }

  /**
   * Get booking creation timestamp
   * @param {string} bookingId - Booking ID
   * @returns {Promise<Date|null>}
   */
  async getCreatedAt(bookingId) {
    const event = await prisma.activityLog.findFirst({
      where: {
        entityId: bookingId,
        entityType: 'BOOKING',
        action: BOOKING_TIMELINE_EVENTS.CREATED
      }
    })

    return event ? event.createdAt : null
  }

  /**
   * Get all events for a resource
   * @param {string} resourceId - Resource ID
   * @param {Object} filters - Filter options
   * @param {Date} filters.startDate - Start date
   * @param {Date} filters.endDate - End date
   * @returns {Promise<Array>} - Timeline events for resource
   */
  async getResourceTimeline(resourceId, filters = {}) {
    if (!resourceId) {
      throw new ValidationError('resourceId is required')
    }

    const { startDate, endDate } = filters

    const where = {
      entityType: 'BOOKING',
      createdAt: {}
    }

    // Add date filters if provided
    if (startDate) {
      where.createdAt.gte = new Date(startDate)
    }

    if (endDate) {
      where.createdAt.lte = new Date(endDate)
    }

    // Get bookings for this resource
    const bookings = await prisma.resourceBooking.findMany({
      where: { resourceId },
      select: { id: true }
    })

    const bookingIds = bookings.map(b => b.id)

    if (bookingIds.length === 0) {
      return []
    }

    // Get events for these bookings
    const events = await prisma.activityLog.findMany({
      where: {
        ...where,
        entityId: { in: bookingIds }
      },
      orderBy: { createdAt: 'asc' }
    })

    return events.map(e => ({
      id: e.id,
      bookingId: e.entityId,
      event: e.action,
      description: e.description,
      performedBy: e.userId,
      timestamp: e.createdAt,
      details: e.details
    }))
  }

  /**
   * Get timeline for multiple bookings (batch query)
   * @param {Array<string>} bookingIds - Array of booking IDs
   * @returns {Promise<Object>} - Map of bookingId to timeline events
   */
  async getBatchTimelines(bookingIds) {
    if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
      return {}
    }

    const events = await prisma.activityLog.findMany({
      where: {
        entityId: { in: bookingIds },
        entityType: 'BOOKING'
      },
      orderBy: { createdAt: 'asc' }
    })

    const result = {}

    bookingIds.forEach(id => {
      result[id] = []
    })

    events.forEach(e => {
      if (!result[e.entityId]) {
        result[e.entityId] = []
      }

      result[e.entityId].push({
        id: e.id,
        event: e.action,
        description: e.description,
        performedBy: e.userId,
        timestamp: e.createdAt,
        details: e.details
      })
    })

    return result
  }

  /**
   * Get status change history for a booking
   * @param {string} bookingId - Booking ID
   * @returns {Promise<Array>} - Status changes with timestamps
   */
  async getStatusHistory(bookingId) {
    const events = await this.getBookingTimeline(bookingId)

    const statusEvents = {
      BOOKING_CREATED: 'Created',
      BOOKING_CONFIRMED: 'Confirmed',
      BOOKING_APPROVED: 'Approved',
      BOOKING_REJECTED: 'Rejected',
      BOOKING_CANCELLED: 'Cancelled',
      BOOKING_COMPLETED: 'Completed'
    }

    return events
      .filter(e => statusEvents[e.event])
      .map(e => ({
        status: statusEvents[e.event],
        changedAt: e.timestamp,
        changedBy: e.performedBy,
        reason: e.details?.reason || e.description
      }))
  }

  /**
   * Check if booking has specific event
   * @param {string} bookingId - Booking ID
   * @param {string} eventType - Event type to check
   * @returns {Promise<boolean>}
   */
  async hasEvent(bookingId, eventType) {
    const event = await prisma.activityLog.findFirst({
      where: {
        entityId: bookingId,
        entityType: 'BOOKING',
        action: eventType
      }
    })

    return !!event
  }

  /**
   * Get first occurrence of event
   * @param {string} bookingId - Booking ID
   * @param {string} eventType - Event type
   * @returns {Promise<Object|null>}
   */
  async getEventFirstOccurrence(bookingId, eventType) {
    return prisma.activityLog.findFirst({
      where: {
        entityId: bookingId,
        entityType: 'BOOKING',
        action: eventType
      },
      orderBy: { createdAt: 'asc' }
    })
  }

  /**
   * Count events by type for booking
   * @param {string} bookingId - Booking ID
   * @returns {Promise<Object>} - Event counts by type
   */
  async getEventCounts(bookingId) {
    const events = await this.getBookingTimeline(bookingId)

    const counts = {}
    events.forEach(e => {
      counts[e.event] = (counts[e.event] || 0) + 1
    })

    return counts
  }
}

export default new BookingTimelineService()
