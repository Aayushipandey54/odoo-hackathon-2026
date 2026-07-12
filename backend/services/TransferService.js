import TransferRepository from '../repositories/TransferRepository.js'
import ActivityLogRepository from '../repositories/ActivityLogRepository.js'
import AssetRepository from '../repositories/AssetRepository.js'
import AllocationRepository from '../repositories/AllocationRepository.js'
import NotificationService from './NotificationService.js'
import TimelineService from './TimelineService.js'
import WorkflowEngine from './WorkflowEngine.js'
import DomainEventService from './DomainEventService.js'
import ApprovalService from './ApprovalService.js'
import { ValidationError, NotFoundError } from '../utils/errors.js'
import { WORKFLOW_TYPES, DOMAIN_EVENTS, TIMELINE_EVENTS } from '../constants/workflowTypes.js'
import { prisma } from '../core/connection.js'

export class TransferService {
  /**
   * Get all transfer requests
   * @returns {Promise} array of transfers
   */
  async getAll() {
    return TransferRepository.findAll({}, {
      include: {
        asset: { include: { category: true } },
        fromEmployee: { include: { department: true } },
        toEmployee: { include: { department: true } }
      }
    })
  }

  /**
   * Get transfer requests by status
   * @param {string} status - Transfer status
   * @param {Object} options - Filter options
   * @returns {Promise} array of transfers
   */
  async getTransfersByStatus(status, options = {}) {
    const { limit = 20, offset = 0 } = options

    return await prisma.transferRequest.findMany({
      where: { status },
      include: {
        asset: { include: { category: true } },
        fromEmployee: { include: { department: true } },
        toEmployee: { include: { department: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })
  }

  /**
   * Get pending transfers for a user (awaiting their approval)
   * @param {string} userId - User ID (approver)
   * @returns {Promise} array of pending transfers
   */
  async getPendingTransfersForApprover(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { employee: true }
    })

    if (!user || !user.employee) {
      throw new NotFoundError('User or employee not found')
    }

    // Get all pending transfers involving this department
    return await prisma.transferRequest.findMany({
      where: {
        status: 'PENDING',
        fromEmployee: {
          departmentId: user.employee.departmentId
        }
      },
      include: {
        asset: { include: { category: true } },
        fromEmployee: { include: { department: true } },
        toEmployee: { include: { department: true } }
      },
      orderBy: { createdAt: 'asc' }
    })
  }

  /**
   * Request asset transfer
   * @param {string} assetId - Asset ID
   * @param {string} fromEmployeeId - Current owner employee ID
   * @param {string} toEmployeeId - Target employee ID
   * @param {string} reason - Transfer reason
   * @param {string} userId - User ID requesting transfer
   * @returns {Promise} created transfer request
   */
  async requestTransfer(assetId, fromEmployeeId, toEmployeeId, reason = null, userId) {
    // Validate that asset exists and is allocated
    const asset = await AssetRepository.findById(assetId)
    if (!asset) {
      throw new ValidationError(`Asset not found: ${assetId}`)
    }

    if (asset.status !== 'ALLOCATED') {
      throw new ValidationError(`Asset must be ALLOCATED to transfer, current status: ${asset.status}`)
    }

    if (asset.assigneeId !== fromEmployeeId) {
      throw new ValidationError(`Asset not currently allocated to ${fromEmployeeId}`)
    }

    if (fromEmployeeId === toEmployeeId) {
      throw new ValidationError('Cannot transfer to the same employee')
    }

    const request = await TransferRepository.create({
      assetId,
      fromEmployeeId,
      toEmployeeId,
      reason,
      status: 'PENDING'
    })

    // Create audit log
    await ActivityLogRepository.create({
      action: 'TRANSFER_REQUESTED',
      details: `Transfer requested for asset ${asset.tag}`,
      entityId: request.id,
      entityType: 'TRANSFER',
      userId,
      metadata: JSON.stringify({
        assetTag: asset.tag,
        from: fromEmployeeId,
        to: toEmployeeId,
        reason
      })
    })

    // Create timeline event
    await TimelineService.createTimelineEvent(
      assetId,
      TIMELINE_EVENTS.ASSET_TRANSFERRED,
      `Transfer requested from employee to another`,
      {
        transferId: request.id,
        from: fromEmployeeId,
        to: toEmployeeId,
        reason
      },
      userId
    )

    // Find approver (department head)
    const fromEmployee = await prisma.employee.findUnique({
      where: { id: fromEmployeeId },
      include: { department: true }
    })

    if (fromEmployee?.department?.headId) {
      // Notify department head
      await NotificationService.createNotification({
        userId: fromEmployee.department.headId,
        type: 'APPROVAL',
        message: `Transfer approval required for asset ${asset.tag}`,
        metadata: {
          transferId: request.id,
          assetId,
          assetTag: asset.tag
        }
      })

      // Create approval request
      await ApprovalService.createApprovalRequest({
        entityType: 'TRANSFER',
        entityId: request.id,
        approverId: fromEmployee.department.headId,
        requestedBy: userId,
        reason
      })
    }

    // Emit domain event
    await DomainEventService.emit(
      DOMAIN_EVENTS.TRANSFER_REQUESTED,
      {
        transferId: request.id,
        assetId,
        assetTag: asset.tag,
        fromEmployeeId,
        toEmployeeId,
        reason
      },
      { userId }
    )

    return request
  }

  /**
   * Approve a transfer request
   * @param {string} transferId - Transfer request ID
   * @param {string} approverId - Approver user ID
   * @param {string} comments - Approval comments
   * @returns {Promise} updated transfer
   */
  async approveTransfer(transferId, approverId, comments = null) {
    const transfer = await TransferRepository.findById(transferId)
    if (!transfer) {
      throw new NotFoundError(`Transfer not found: ${transferId}`)
    }

    if (transfer.status !== 'PENDING') {
      throw new ValidationError(`Cannot approve ${transfer.status} transfer`)
    }

    // Execute approval workflow in transaction
    return await WorkflowEngine.executeWorkflow(
      WORKFLOW_TYPES.TRANSFER,
      {
        transferId,
        assetId: transfer.assetId,
        fromEmployeeId: transfer.fromEmployeeId,
        toEmployeeId: transfer.toEmployeeId
      },
      approverId,
      async (tx) => {
        // Update transfer to approved
        const updatedTransfer = await tx.transferRequest.update({
          where: { id: transferId },
          data: {
            status: 'APPROVED',
            approvedAt: new Date(),
            approvedBy: approverId
          },
          include: {
            asset: { include: { category: true } },
            fromEmployee: { include: { department: true } },
            toEmployee: { include: { department: true } }
          }
        })

        // Close old allocation
        const oldAllocation = await tx.assetAllocation.updateMany({
          where: {
            assetId: transfer.assetId,
            employeeId: transfer.fromEmployeeId,
            returnedAt: null
          },
          data: { returnedAt: new Date() }
        })

        // Create new allocation for new owner
        const newAllocation = await tx.assetAllocation.create({
          data: {
            assetId: transfer.assetId,
            employeeId: transfer.toEmployeeId,
            allocatedAt: new Date()
          }
        })

        // Update asset ownership
        await tx.asset.update({
          where: { id: transfer.assetId },
          data: { assigneeId: transfer.toEmployeeId }
        })

        // Create audit log
        await tx.activityLog.create({
          data: {
            action: 'TRANSFER_APPROVED',
            details: `Transfer approved for asset ${updatedTransfer.asset.tag}`,
            entityId: transferId,
            entityType: 'TRANSFER',
            userId: approverId,
            metadata: JSON.stringify({
              assetTag: updatedTransfer.asset.tag,
              from: transfer.fromEmployeeId,
              to: transfer.toEmployeeId,
              comments
            })
          }
        })

        // Create timeline events for both employees
        await tx.assetTimeline.create({
          data: {
            assetId: transfer.assetId,
            event: TIMELINE_EVENTS.ASSET_TRANSFERRED,
            description: `Transferred from ${updatedTransfer.fromEmployee.name} to ${updatedTransfer.toEmployee.name}`,
            details: JSON.stringify({
              fromEmployeeId: transfer.fromEmployeeId,
              toEmployeeId: transfer.toEmployeeId,
              transferId,
              approvedBy: approverId,
              comments
            }),
            performedBy: approverId
          }
        })

        return { transfer: updatedTransfer, newAllocation }
      }
    ).then(async (result) => {
      // Notify all parties (outside transaction)
      const transfer = result.transfer
      const asset = transfer.asset

      // Notify original owner
      await NotificationService.createNotification({
        userId: transfer.fromEmployee.userId,
        type: 'TRANSFER',
        message: `Asset "${asset.name}" transfer to ${transfer.toEmployee.name} has been approved`,
        metadata: {
          assetId: asset.id,
          transferId: transfer.id
        }
      })

      // Notify new owner
      await NotificationService.createNotification({
        userId: transfer.toEmployee.userId,
        type: 'TRANSFER',
        message: `Asset "${asset.name}" has been transferred to you`,
        metadata: {
          assetId: asset.id,
          transferId: transfer.id
        }
      })

      // Emit domain event
      await DomainEventService.emit(
        DOMAIN_EVENTS.TRANSFER_APPROVED,
        {
          transferId: transfer.id,
          assetId: asset.id,
          assetTag: asset.tag,
          from: transfer.fromEmployeeId,
          to: transfer.toEmployeeId,
          approvedBy: approverId
        },
        { userId: approverId }
      )

      return transfer
    })
  }

  /**
   * Reject a transfer request
   * @param {string} transferId - Transfer request ID
   * @param {string} rejecterId - Rejecter user ID
   * @param {string} reason - Rejection reason
   * @returns {Promise} updated transfer
   */
  async rejectTransfer(transferId, rejecterId, reason) {
    if (!reason || reason.trim() === '') {
      throw new ValidationError('Rejection reason is required')
    }

    const transfer = await TransferRepository.findById(transferId)
    if (!transfer) {
      throw new NotFoundError(`Transfer not found: ${transferId}`)
    }

    if (transfer.status !== 'PENDING') {
      throw new ValidationError(`Cannot reject ${transfer.status} transfer`)
    }

    // Update transfer
    const updated = await TransferRepository.update(transferId, {
      status: 'REJECTED',
      rejectedAt: new Date(),
      rejectedBy: rejecterId,
      rejectionReason: reason
    })

    // Create audit log
    await ActivityLogRepository.create({
      action: 'TRANSFER_REJECTED',
      details: `Transfer rejected for asset ${transfer.assetId}`,
      entityId: transferId,
      entityType: 'TRANSFER',
      userId: rejecterId,
      metadata: JSON.stringify({ reason })
    })

    // Notify requester
    const fromEmployee = await prisma.employee.findUnique({
      where: { id: transfer.fromEmployeeId },
      include: { user: true }
    })

    if (fromEmployee?.user?.id) {
      await NotificationService.createNotification({
        userId: fromEmployee.user.id,
        type: 'TRANSFER',
        message: `Asset transfer request has been rejected`,
        metadata: {
          transferId,
          reason
        }
      })
    }

    // Emit domain event
    await DomainEventService.emit(
      DOMAIN_EVENTS.TRANSFER_REJECTED,
      {
        transferId,
        assetId: transfer.assetId,
        reason
      },
      { userId: rejecterId }
    )

    return updated
  }
}

export default new TransferService()
