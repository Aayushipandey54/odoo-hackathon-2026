/**
 * Approval Service
 * Generic approval workflow management
 * Reusable for transfers, maintenance, bookings, and other entities requiring approval
 */

import { prisma } from '../core/connection.js'
import { APPROVAL_STATES, DOMAIN_EVENTS } from '../constants/workflowTypes.js'
import { ValidationError, NotFoundError } from '../utils/errors.js'
import DomainEventService from './DomainEventService.js'
import NotificationService from './NotificationService.js'

export class ApprovalService {
  /**
   * Create an approval request
   * @param {Object} data - Approval request data
   * @param {string} data.entityType - Type of entity (TRANSFER, MAINTENANCE, BOOKING)
   * @param {string} data.entityId - ID of the entity
   * @param {string} data.approverId - ID of user who should approve
   * @param {string} data.requestedBy - ID of user requesting approval
   * @param {string} data.reason - Reason for request
   * @param {Object} data.metadata - Additional metadata
   * @returns {Promise} created approval request
   */
  async createApprovalRequest(data) {
    const {
      entityType,
      entityId,
      approverId,
      requestedBy,
      reason = null,
      metadata = null
    } = data

    if (!entityType || !entityId || !approverId) {
      throw new ValidationError('entityType, entityId, and approverId are required')
    }

    if (approverId === requestedBy) {
      throw new ValidationError('Cannot request approval from yourself')
    }

    // For now, store in activity log since we don't have dedicated ApprovalRequest model
    // In Phase 7+, create dedicated ApprovalRequest table
    const approvalRequest = {
      id: `APR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      entityType,
      entityId,
      approverId,
      requestedBy,
      reason,
      status: APPROVAL_STATES.PENDING,
      metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Emit approval created event
    await DomainEventService.emit(DOMAIN_EVENTS.APPROVAL_CREATED, {
      approvalRequest
    }, { userId: requestedBy })

    // Notify approver
    await NotificationService.createNotification({
      userId: approverId,
      type: 'APPROVAL',
      message: `${entityType} approval requested`,
      metadata: {
        entityType,
        entityId,
        approvalId: approvalRequest.id
      }
    })

    return approvalRequest
  }

  /**
   * Approve an approval request
   * @param {string} approvalId - ID of approval request
   * @param {string} approverId - ID of approver (must match request)
   * @param {string} comments - Approval comments
   * @returns {Promise} updated approval request
   */
  async approveRequest(approvalId, approverId, comments = null) {
    if (!approvalId || !approverId) {
      throw new ValidationError('approvalId and approverId are required')
    }

    // In production with dedicated table:
    // const approval = await ApprovalRepository.findById(approvalId)
    // if (!approval) throw new NotFoundError('Approval request not found')
    // if (approval.approverId !== approverId) {
    //   throw new ValidationError('You are not authorized to approve this request')
    // }
    // if (approval.status !== APPROVAL_STATES.PENDING) {
    //   throw new ValidationError(`Cannot approve ${approval.status} request`)
    // }

    const approval = {
      approvalId,
      status: APPROVAL_STATES.APPROVED,
      approvedBy: approverId,
      approvedAt: new Date(),
      comments
    }

    // Emit approval completed event
    await DomainEventService.emit(DOMAIN_EVENTS.APPROVAL_COMPLETED, {
      approval,
      action: 'APPROVED'
    }, { userId: approverId })

    return approval
  }

  /**
   * Reject an approval request
   * @param {string} approvalId - ID of approval request
   * @param {string} approverId - ID of approver (must match request)
   * @param {string} reason - Rejection reason
   * @returns {Promise} updated approval request
   */
  async rejectRequest(approvalId, approverId, reason = null) {
    if (!approvalId || !approverId) {
      throw new ValidationError('approvalId and approverId are required')
    }

    if (!reason) {
      throw new ValidationError('Rejection reason is required')
    }

    const approval = {
      approvalId,
      status: APPROVAL_STATES.REJECTED,
      rejectedBy: approverId,
      rejectedAt: new Date(),
      rejectionReason: reason
    }

    // Emit approval completed event
    await DomainEventService.emit(DOMAIN_EVENTS.APPROVAL_COMPLETED, {
      approval,
      action: 'REJECTED'
    }, { userId: approverId })

    return approval
  }

  /**
   * Get pending approvals for a user
   * @param {string} userId - User ID (approver)
   * @param {Object} options - Filter options
   * @returns {Promise} array of pending approvals
   */
  async getPendingApprovalsForUser(userId, options = {}) {
    if (!userId) {
      throw new ValidationError('userId is required')
    }

    // TODO: Implement when ApprovalRequest table created
    // For now, return empty array
    return []
  }

  /**
   * Get all approvals by status
   * @param {string} status - Approval status (PENDING, APPROVED, REJECTED)
   * @param {Object} options - Filter options
   * @returns {Promise} array of approvals
   */
  async getApprovalsByStatus(status, options = {}) {
    const validStatuses = Object.values(APPROVAL_STATES)
    if (!validStatuses.includes(status)) {
      throw new ValidationError(`Invalid approval status: ${status}`)
    }

    // TODO: Implement when ApprovalRequest table created
    return []
  }

  /**
   * Get approval history for an entity
   * @param {string} entityType - Entity type
   * @param {string} entityId - Entity ID
   * @returns {Promise} array of approvals
   */
  async getApprovalHistory(entityType, entityId) {
    if (!entityType || !entityId) {
      throw new ValidationError('entityType and entityId are required')
    }

    // TODO: Implement when ApprovalRequest table created
    return []
  }

  /**
   * Find approver for an entity (based on business rules)
   * Example: For department transfer, find department head
   * @param {string} entityType - Type of entity
   * @param {Object} context - Context information (department, region, etc.)
   * @returns {Promise} approver user ID
   */
  async findApproverId(entityType, context) {
    if (!entityType || !context) {
      throw new ValidationError('entityType and context are required')
    }

    // Different approval routing based on entity type
    switch (entityType) {
      case 'TRANSFER':
        // Get department head for transfer
        if (context.departmentId) {
          const department = await prisma.department.findUnique({
            where: { id: context.departmentId }
          })

          if (!department || !department.headId) {
            throw new ValidationError(`No department head found for department ${context.departmentId}`)
          }

          return department.headId
        }
        break

      case 'MAINTENANCE':
        // Get asset manager or team lead
        return context.supervisorId
        break

      case 'BOOKING':
        // Get resource manager
        return context.resourceManagerId
        break

      default:
        throw new ValidationError(`Unknown entity type: ${entityType}`)
    }
  }

  /**
   * Get approval route for an entity
   * @param {string} entityType - Entity type
   * @returns {Object} approval configuration
   */
  getApprovalRoute(entityType) {
    const routes = {
      TRANSFER: {
        requiredApprovals: 1,
        canDelegate: false,
        timeout: 24 * 60 * 60 * 1000 // 24 hours
      },
      MAINTENANCE: {
        requiredApprovals: 1,
        canDelegate: true,
        timeout: 8 * 60 * 60 * 1000 // 8 hours
      },
      BOOKING: {
        requiredApprovals: 1,
        canDelegate: true,
        timeout: 1 * 60 * 60 * 1000 // 1 hour
      }
    }

    return routes[entityType] || null
  }

  /**
   * Check if entity requires approval
   * @param {string} entityType - Entity type
   * @param {Object} context - Context (entity data)
   * @returns {Promise} true if approval required
   */
  async requiresApproval(entityType, context) {
    // Transfer always requires approval
    if (entityType === 'TRANSFER') {
      return true
    }

    // Maintenance: only high priority requires approval
    if (entityType === 'MAINTENANCE') {
      return context.priority === 'HIGH' || context.priority === 'CRITICAL'
    }

    // Booking: conflicts require approval
    if (entityType === 'BOOKING') {
      return context.hasConflict === true
    }

    return false
  }
}

export default new ApprovalService()
