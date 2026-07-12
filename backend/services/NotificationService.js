import NotificationRepository from '../repositories/NotificationRepository.js'
import { prisma } from '../core/connection.js'
import { ValidationError, NotFoundError } from '../utils/errors.js'

export class NotificationService {
  /**
   * Get all notifications
   * @param {Object} options - Query options
   * @returns {Promise} array of notifications
   */
  async getAll(options = {}) {
    return NotificationRepository.findAll({}, {
      orderBy: { createdAt: 'desc' },
      ...options
    })
  }

  /**
   * Create a notification
   * @param {Object} data - Notification data
   * @param {string} data.userId - User ID
   * @param {string} data.type - Notification type (ALLOCATION, TRANSFER, APPROVAL, etc.)
   * @param {string} data.message - Notification message
   * @param {Object} data.metadata - Additional metadata
   * @returns {Promise} created notification
   */
  async createNotification(data) {
    const { userId, type, message, metadata = null } = data

    if (!userId) {
      throw new ValidationError('userId is required')
    }

    if (!type) {
      throw new ValidationError('type is required')
    }

    if (!message) {
      throw new ValidationError('message is required')
    }

    return await prisma.notification.create({
      data: {
        userId,
        type,
        message,
        isRead: false,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    })
  }

  /**
   * Create multiple notifications in batch
   * @param {Array} notifications - Array of notification data
   * @returns {Promise} array of created notifications
   */
  async createBatch(notifications) {
    if (!Array.isArray(notifications) || notifications.length === 0) {
      throw new ValidationError('notifications must be a non-empty array')
    }

    const created = await Promise.all(
      notifications.map(notif => this.createNotification(notif))
    )

    return created
  }

  /**
   * Get notifications for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise} user's notifications
   */
  async getNotificationsByUser(userId, options = {}) {
    if (!userId) {
      throw new ValidationError('userId is required')
    }

    const { limit = 50, offset = 0, isRead = null } = options

    const where = { userId }
    if (isRead !== null) {
      where.isRead = isRead
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    const total = await prisma.notification.count({ where })

    return {
      data: notifications,
      total,
      count: notifications.length,
      offset,
      limit
    }
  }

  /**
   * Get unread notifications for a user
   * @param {string} userId - User ID
   * @returns {Promise} array of unread notifications
   */
  async getUnreadNotifications(userId) {
    if (!userId) {
      throw new ValidationError('userId is required')
    }

    return await prisma.notification.findMany({
      where: {
        userId,
        isRead: false
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  /**
   * Get unread count for a user
   * @param {string} userId - User ID
   * @returns {Promise} number of unread notifications
   */
  async getUnreadCount(userId) {
    if (!userId) {
      throw new ValidationError('userId is required')
    }

    return await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    })
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise} updated notification
   */
  async markAsRead(notificationId) {
    if (!notificationId) {
      throw new ValidationError('notificationId is required')
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    })

    if (!notification) {
      throw new NotFoundError(`Notification not found: ${notificationId}`)
    }

    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    })
  }

  /**
   * Mark all notifications as read for a user
   * @param {string} userId - User ID
   * @returns {Promise} count of updated notifications
   */
  async markAllAsRead(userId) {
    if (!userId) {
      throw new ValidationError('userId is required')
    }

    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: { isRead: true }
    })

    return result.count
  }

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise} deleted notification
   */
  async deleteNotification(notificationId) {
    if (!notificationId) {
      throw new ValidationError('notificationId is required')
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    })

    if (!notification) {
      throw new NotFoundError(`Notification not found: ${notificationId}`)
    }

    return await prisma.notification.delete({
      where: { id: notificationId }
    })
  }

  /**
   * Filter notifications by type
   * @param {string} userId - User ID
   * @param {string} type - Notification type
   * @returns {Promise} filtered notifications
   */
  async getNotificationsByType(userId, type) {
    if (!userId || !type) {
      throw new ValidationError('userId and type are required')
    }

    return await prisma.notification.findMany({
      where: {
        userId,
        type
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  /**
   * Get notification statistics for a user
   * @param {string} userId - User ID
   * @returns {Promise} notification stats
   */
  async getNotificationStats(userId) {
    if (!userId) {
      throw new ValidationError('userId is required')
    }

    const total = await prisma.notification.count({
      where: { userId }
    })

    const unread = await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    })

    const byType = await prisma.notification.groupBy({
      by: ['type'],
      where: { userId },
      _count: true
    })

    return {
      total,
      unread,
      read: total - unread,
      byType: byType.map(item => ({
        type: item.type,
        count: item._count
      }))
    }
  }

  /**
   * Booking notification handlers
   * Called by BookingService when booking events occur
   */

  /**
   * Notify about booking creation
   * @param {Object} data - Booking data
   */
  async notifyBookingCreated(data) {
    const { bookingId, resourceName, employeeName, departmentName, status, approverUserId } = data

    // Notify employee of their booking
    await this.createNotification({
      userId: data.employeeId,
      type: 'BOOKING',
      message: `Your booking for ${resourceName} has been ${status === 'CONFIRMED' ? 'confirmed' : 'submitted for approval'}`,
      metadata: { bookingId, resourceName, type: 'booking_created' }
    })

    // If requires approval, notify approver
    if (approverUserId) {
      await this.createNotification({
        userId: approverUserId,
        type: 'APPROVAL',
        message: `Booking request from ${employeeName} for ${resourceName} requires your approval`,
        metadata: { bookingId, resourceName, employeeName, type: 'booking_approval_needed' }
      })
    }
  }

  /**
   * Notify about booking approval
   * @param {Object} data - Booking data
   */
  async notifyBookingApproved(data) {
    const { bookingId, resourceName, employeeName, approverName } = data

    await this.createNotification({
      userId: data.employeeId,
      type: 'BOOKING',
      message: `Your booking for ${resourceName} has been approved by ${approverName}`,
      metadata: { bookingId, resourceName, type: 'booking_approved' }
    })
  }

  /**
   * Notify about booking rejection
   * @param {Object} data - Booking data
   */
  async notifyBookingRejected(data) {
    const { bookingId, resourceName, reason } = data

    await this.createNotification({
      userId: data.employeeId,
      type: 'BOOKING',
      message: `Your booking for ${resourceName} has been rejected. Reason: ${reason}`,
      metadata: { bookingId, resourceName, reason, type: 'booking_rejected' }
    })
  }

  /**
   * Notify about booking cancellation
   * @param {Object} data - Booking data
   */
  async notifyBookingCancelled(data) {
    const { bookingId, resourceName, reason } = data

    // Notify employee
    await this.createNotification({
      userId: data.employeeId,
      type: 'BOOKING',
      message: `Your booking for ${resourceName} has been cancelled. Reason: ${reason}`,
      metadata: { bookingId, resourceName, reason, type: 'booking_cancelled' }
    })
  }

  /**
   * Notify about upcoming booking reminder
   * @param {Object} data - Booking data
   */
  async notifyUpcomingBooking(data) {
    const { bookingId, resourceName, hoursUntil } = data

    await this.createNotification({
      userId: data.employeeId,
      type: 'BOOKING',
      message: `Reminder: Your booking for ${resourceName} starts in ${hoursUntil} hour${hoursUntil > 1 ? 's' : ''}`,
      metadata: { bookingId, resourceName, type: 'booking_reminder' }
    })
  }

  /**
   * Subscribe to booking domain events
   * Should be called at application startup
   */
  static subscribeToBookingEvents(domainEventService) {
    if (!domainEventService) {
      throw new Error('domainEventService is required')
    }

    const notificationService = new NotificationService()

    // Subscribe to booking events
    domainEventService.subscribe('BOOKING_CREATED', async (event) => {
      try {
        await notificationService.notifyBookingCreated(event.data)
      } catch (error) {
        console.error('Error sending booking created notification:', error)
      }
    })

    domainEventService.subscribe('BOOKING_APPROVED', async (event) => {
      try {
        await notificationService.notifyBookingApproved(event.data)
      } catch (error) {
        console.error('Error sending booking approved notification:', error)
      }
    })

    domainEventService.subscribe('BOOKING_REJECTED', async (event) => {
      try {
        await notificationService.notifyBookingRejected(event.data)
      } catch (error) {
        console.error('Error sending booking rejected notification:', error)
      }
    })

    domainEventService.subscribe('BOOKING_CANCELLED', async (event) => {
      try {
        await notificationService.notifyBookingCancelled(event.data)
      } catch (error) {
        console.error('Error sending booking cancelled notification:', error)
      }
    })
  }
}

export default new NotificationService()
