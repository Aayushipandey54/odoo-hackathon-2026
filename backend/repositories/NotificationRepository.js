import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class NotificationRepository extends GenericRepository {
  constructor() {
    super(prisma.notification)
  }

  /**
   * Find notifications by user with filtering
   * @param {string} userId - User ID
   * @param {Object} options - Filter options
   * @returns {Promise} array of notifications
   */
  async findByUser(userId, options = {}) {
    const { limit = 50, offset = 0, isRead = null, type = null } = options

    const where = { userId }
    
    if (isRead !== null) {
      where.isRead = isRead
    }
    
    if (type) {
      where.type = type
    }

    return await this.model.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })
  }

  /**
   * Count unread notifications for a user
   * @param {string} userId - User ID
   * @returns {Promise} count of unread
   */
  async countUnread(userId) {
    return await this.model.count({
      where: {
        userId,
        isRead: false
      }
    })
  }

  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   * @returns {Promise} updated notification
   */
  async markAsRead(id) {
    return await this.model.update({
      where: { id },
      data: { isRead: true }
    })
  }

  /**
   * Mark multiple notifications as read
   * @param {string[]} ids - Array of notification IDs
   * @returns {Promise} count of updated
   */
  async markMultipleAsRead(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return { count: 0 }
    }

    return await this.model.updateMany({
      where: { id: { in: ids } },
      data: { isRead: true }
    })
  }

  /**
   * Mark all user notifications as read
   * @param {string} userId - User ID
   * @returns {Promise} count of updated
   */
  async markAllUserAsRead(userId) {
    return await this.model.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: { isRead: true }
    })
  }

  /**
   * Delete old notifications (cleanup)
   * @param {number} daysOld - Delete notifications older than X days
   * @returns {Promise} count of deleted
   */
  async deleteOldNotifications(daysOld = 30) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    return await this.model.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        isRead: true
      }
    })
  }
}

export default new NotificationRepository()
