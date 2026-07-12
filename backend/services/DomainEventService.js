/**
 * Domain Event Service
 * Event bus for publishing and subscribing to domain events
 * Enables loose coupling between modules
 * Used by: Timeline, Notifications, ActivityLog, and future phases
 */

import { EventEmitter } from 'events'

export class DomainEventService {
  constructor() {
    this.eventEmitter = new EventEmitter()
    // Allow unlimited listeners for testing
    this.eventEmitter.setMaxListeners(0)
  }

  /**
   * Domain event types
   */
  static EVENT_TYPES = {
    // Allocation events
    ASSET_ALLOCATED: 'ASSET_ALLOCATED',
    ASSET_RETURNED: 'ASSET_RETURNED',

    // Transfer events
    ASSET_TRANSFERRED: 'ASSET_TRANSFERRED',
    TRANSFER_APPROVED: 'TRANSFER_APPROVED',
    TRANSFER_REJECTED: 'TRANSFER_REJECTED',

    // Booking events (Phase 7)
    BOOKING_CREATED: 'BOOKING_CREATED',
    BOOKING_APPROVED: 'BOOKING_APPROVED',
    BOOKING_REJECTED: 'BOOKING_REJECTED',
    BOOKING_CANCELLED: 'BOOKING_CANCELLED',
    BOOKING_COMPLETED: 'BOOKING_COMPLETED',
    BOOKING_MODIFIED: 'BOOKING_MODIFIED',

    // Maintenance events (Phase 8)
    MAINTENANCE_STARTED: 'MAINTENANCE_STARTED',
    MAINTENANCE_RESOLVED: 'MAINTENANCE_RESOLVED',

    // Workflow events
    WORKFLOW_COMPLETED: 'WORKFLOW_COMPLETED',
    WORKFLOW_FAILED: 'WORKFLOW_FAILED',

    // Approval events
    APPROVAL_CREATED: 'APPROVAL_CREATED',
    APPROVAL_APPROVED: 'APPROVAL_APPROVED',
    APPROVAL_REJECTED: 'APPROVAL_REJECTED'
  }

  /**
   * Publish a domain event
   * @param {string} eventType - Type of event (from EVENT_TYPES)
   * @param {Object} payload - Event data
   * @param {string} payload.aggregateId - Asset ID or related entity ID
   * @param {string} payload.userId - User who triggered event
   * @param {Object} payload.data - Event-specific data
   */
  emit(eventType, payload) {
    if (!eventType) {
      throw new Error('Event type is required')
    }

    if (!payload || !payload.aggregateId) {
      throw new Error('Payload with aggregateId is required')
    }

    const event = {
      type: eventType,
      aggregateId: payload.aggregateId,
      userId: payload.userId || 'system',
      data: payload.data || {},
      timestamp: new Date(),
      id: this.generateEventId()
    }

    // Emit event for all subscribers
    this.eventEmitter.emit(eventType, event)

    // Also emit to a wildcard listener for logging/debugging
    this.eventEmitter.emit('*', event)

    return event
  }

  /**
   * Subscribe to a domain event
   * @param {string} eventType - Event type to listen for
   * @param {Function} handler - Callback function(event)
   * @returns {Function} - Unsubscribe function
   */
  subscribe(eventType, handler) {
    if (!eventType || typeof handler !== 'function') {
      throw new Error('Event type and handler function are required')
    }

    this.eventEmitter.on(eventType, handler)

    // Return unsubscribe function
    return () => {
      this.eventEmitter.off(eventType, handler)
    }
  }

  /**
   * Subscribe to event once, then automatically unsubscribe
   * @param {string} eventType - Event type to listen for
   * @param {Function} handler - Callback function(event)
   */
  subscribeOnce(eventType, handler) {
    if (!eventType || typeof handler !== 'function') {
      throw new Error('Event type and handler function are required')
    }

    this.eventEmitter.once(eventType, handler)
  }

  /**
   * Unsubscribe from an event
   * @param {string} eventType - Event type
   * @param {Function} handler - Handler function to remove
   */
  unsubscribe(eventType, handler) {
    this.eventEmitter.off(eventType, handler)
  }

  /**
   * Get all subscribers for an event
   * @param {string} eventType - Event type
   * @returns {number} - Number of subscribers
   */
  getSubscriberCount(eventType) {
    return this.eventEmitter.listenerCount(eventType)
  }

  /**
   * Remove all subscribers (useful for testing)
   * @param {string} eventType - Event type (optional, removes all if not provided)
   */
  clearSubscribers(eventType) {
    if (eventType) {
      this.eventEmitter.removeAllListeners(eventType)
    } else {
      this.eventEmitter.removeAllListeners()
    }
  }

  /**
   * Generate unique event ID
   * @returns {string} - Unique event ID
   * @private
   */
  generateEventId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Create event payload helper
   * @param {string} aggregateId - Asset ID
   * @param {Object} data - Event data
   * @param {string} userId - User ID (optional)
   * @returns {Object} - Payload object
   */
  static createPayload(aggregateId, data = {}, userId = 'system') {
    return {
      aggregateId,
      data,
      userId
    }
  }
}

// Export singleton instance
export default new DomainEventService()
