import MaintenanceRepository from '../repositories/MaintenanceRepository.js'
import ActivityLogRepository from '../repositories/ActivityLogRepository.js'
import AssetRepository from '../repositories/AssetRepository.js'
import { prisma } from '../core/connection.js'
import { NotFoundError, ValidationError } from '../utils/errors.js'

export class MaintenanceService {
  // Helper to fetch the performer's display name for history logs
  async _resolvePerformerName(userId) {
    if (!userId || userId === 'system') return 'System'
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { employee: true }
    })
    return user?.employee?.name || user?.email || 'System'
  }

  async getAll() {
    return prisma.maintenanceRequest.findMany({
      where: { deletedAt: null },
      include: {
        asset: true,
        technician: true,
        history: {
          orderBy: { timestamp: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getById(id) {
    const request = await prisma.maintenanceRequest.findFirst({
      where: { id, deletedAt: null },
      include: {
        asset: true,
        technician: true,
        history: {
          orderBy: { timestamp: 'asc' }
        }
      }
    })
    if (!request) {
      throw new NotFoundError(`Maintenance Request not found for id "${id}"`)
    }
    return request
  }

  async create(data, userId) {
    const { assetId, issue, priority, attachments } = data

    // Verify asset exists
    const asset = await AssetRepository.findById(assetId)
    if (!asset) {
      throw new NotFoundError(`Asset not found for id "${assetId}"`)
    }

    const performerName = await this._resolvePerformerName(userId)

    return await prisma.$transaction(async (tx) => {
      // Create request with status PENDING
      const request = await tx.maintenanceRequest.create({
        data: {
          assetId,
          issue,
          priority: priority || 'MEDIUM',
          status: 'PENDING',
          attachments: attachments ? JSON.stringify(attachments) : null
        }
      })

      // Log initial history entry
      await tx.maintenanceHistory.create({
        data: {
          requestId: request.id,
          performedBy: performerName,
          previousStatus: null,
          newStatus: 'PENDING',
          remarks: 'Maintenance request created'
        }
      })

      // Log activity log entry
      await tx.activityLog.create({
        data: {
          action: 'MAINTENANCE_REQUESTED',
          details: `Maintenance requested for asset ${asset.tag}`,
          entityId: request.id,
          entityType: 'MAINTENANCE',
          userId
        }
      })

      return request
    })
  }

  async approve(id, userId) {
    const request = await this.getById(id)
    if (request.status !== 'PENDING') {
      throw new ValidationError(`Invalid status transition: Only PENDING requests can be approved. Current status: ${request.status}`)
    }

    const performerName = await this._resolvePerformerName(userId)

    return await prisma.$transaction(async (tx) => {
      // Update request status
      const updatedRequest = await tx.maintenanceRequest.update({
        where: { id },
        data: { status: 'APPROVED' }
      })

      // Update asset status to UNDER_MAINTENANCE
      await tx.asset.update({
        where: { id: request.assetId },
        data: { status: 'UNDER_MAINTENANCE' }
      })

      // Log history
      await tx.maintenanceHistory.create({
        data: {
          requestId: id,
          performedBy: performerName,
          previousStatus: 'PENDING',
          newStatus: 'APPROVED',
          remarks: 'Request approved'
        }
      })

      // Log activity
      await tx.activityLog.create({
        data: {
          action: 'MAINTENANCE_APPROVED',
          details: `Maintenance request for asset ${request.asset.tag} approved`,
          entityId: id,
          entityType: 'MAINTENANCE',
          userId
        }
      })

      return updatedRequest
    })
  }

  async reject(id, remarks, userId) {
    const request = await this.getById(id)
    if (request.status !== 'PENDING') {
      throw new ValidationError(`Invalid status transition: Only PENDING requests can be rejected. Current status: ${request.status}`)
    }

    const performerName = await this._resolvePerformerName(userId)

    return await prisma.$transaction(async (tx) => {
      // Update request status
      const updatedRequest = await tx.maintenanceRequest.update({
        where: { id },
        data: { status: 'REJECTED' }
      })

      // Log history
      await tx.maintenanceHistory.create({
        data: {
          requestId: id,
          performedBy: performerName,
          previousStatus: 'PENDING',
          newStatus: 'REJECTED',
          remarks: remarks || 'Request rejected'
        }
      })

      // Log activity
      await tx.activityLog.create({
        data: {
          action: 'MAINTENANCE_REJECTED',
          details: `Maintenance request for asset ${request.asset.tag} rejected`,
          entityId: id,
          entityType: 'MAINTENANCE',
          userId
        }
      })

      return updatedRequest
    })
  }

  async assignTechnician(id, technicianId, userId) {
    const request = await this.getById(id)
    if (request.status !== 'APPROVED' && request.status !== 'TECHNICIAN_ASSIGNED') {
      throw new ValidationError(`Invalid status transition: Technician can only be assigned to APPROVED or TECHNICIAN_ASSIGNED requests. Current status: ${request.status}`)
    }

    // Verify technician exists
    const technician = await prisma.employee.findUnique({
      where: { id: technicianId }
    })
    if (!technician) {
      throw new NotFoundError(`Technician (Employee) not found for id "${technicianId}"`)
    }

    const performerName = await this._resolvePerformerName(userId)

    return await prisma.$transaction(async (tx) => {
      const prevStatus = request.status

      // Update request
      const updatedRequest = await tx.maintenanceRequest.update({
        where: { id },
        data: {
          status: 'TECHNICIAN_ASSIGNED',
          technicianId,
          assignedDate: new Date()
        }
      })

      // Log history
      await tx.maintenanceHistory.create({
        data: {
          requestId: id,
          performedBy: performerName,
          previousStatus: prevStatus,
          newStatus: 'TECHNICIAN_ASSIGNED',
          remarks: `Technician assigned: ${technician.name}`
        }
      })

      // Log activity
      await tx.activityLog.create({
        data: {
          action: 'MAINTENANCE_ASSIGNED',
          details: `Technician ${technician.name} assigned to maintenance request ${id}`,
          entityId: id,
          entityType: 'MAINTENANCE',
          userId
        }
      })

      return updatedRequest
    })
  }

  async startWork(id, userId) {
    const request = await this.getById(id)
    if (request.status !== 'TECHNICIAN_ASSIGNED') {
      throw new ValidationError(`Invalid status transition: Work can only be started when status is TECHNICIAN_ASSIGNED. Current status: ${request.status}`)
    }

    const performerName = await this._resolvePerformerName(userId)

    return await prisma.$transaction(async (tx) => {
      // Update status to IN_PROGRESS
      const updatedRequest = await tx.maintenanceRequest.update({
        where: { id },
        data: { status: 'IN_PROGRESS' }
      })

      // Log history
      await tx.maintenanceHistory.create({
        data: {
          requestId: id,
          performedBy: performerName,
          previousStatus: 'TECHNICIAN_ASSIGNED',
          newStatus: 'IN_PROGRESS',
          remarks: 'Work started on request'
        }
      })

      // Log activity
      await tx.activityLog.create({
        data: {
          action: 'MAINTENANCE_STARTED',
          details: `Work started on maintenance request for asset ${request.asset.tag}`,
          entityId: id,
          entityType: 'MAINTENANCE',
          userId
        }
      })

      return updatedRequest
    })
  }

  async resolve(id, resolutionData, userId) {
    const { repairNotes, resolutionSummary } = resolutionData
    const request = await this.getById(id)
    if (request.status !== 'IN_PROGRESS') {
      throw new ValidationError(`Invalid status transition: Only IN_PROGRESS requests can be resolved. Current status: ${request.status}`)
    }

    const performerName = await this._resolvePerformerName(userId)

    return await prisma.$transaction(async (tx) => {
      // Update request status to RESOLVED
      const updatedRequest = await tx.maintenanceRequest.update({
        where: { id },
        data: {
          status: 'RESOLVED',
          repairNotes,
          resolutionSummary,
          resolvedAt: new Date()
        }
      })

      // Update asset back to AVAILABLE, and clear assigneeId (make it available for reassignment)
      await tx.asset.update({
        where: { id: request.assetId },
        data: {
          status: 'AVAILABLE',
          assigneeId: null
        }
      })

      // Log history
      await tx.maintenanceHistory.create({
        data: {
          requestId: id,
          performedBy: performerName,
          previousStatus: 'IN_PROGRESS',
          newStatus: 'RESOLVED',
          remarks: `Resolved: ${resolutionSummary || 'Service complete'}`
        }
      })

      // Log activity
      await tx.activityLog.create({
        data: {
          action: 'MAINTENANCE_RESOLVED',
          details: `Maintenance request resolved for asset ${request.asset.tag}`,
          entityId: id,
          entityType: 'MAINTENANCE',
          userId
        }
      })

      return updatedRequest
    })
  }

  async close(id, remarks, userId) {
    const request = await this.getById(id)
    if (request.status !== 'RESOLVED') {
      throw new ValidationError(`Invalid status transition: Only RESOLVED requests can be closed. Current status: ${request.status}`)
    }

    const performerName = await this._resolvePerformerName(userId)

    return await prisma.$transaction(async (tx) => {
      // Update status to CLOSED
      const updatedRequest = await tx.maintenanceRequest.update({
        where: { id },
        data: { status: 'CLOSED' }
      })

      // Log history
      await tx.maintenanceHistory.create({
        data: {
          requestId: id,
          performedBy: performerName,
          previousStatus: 'RESOLVED',
          newStatus: 'CLOSED',
          remarks: remarks || 'Ticket closed'
        }
      })

      // Log activity
      await tx.activityLog.create({
        data: {
          action: 'MAINTENANCE_CLOSED',
          details: `Maintenance request ${id} closed`,
          entityId: id,
          entityType: 'MAINTENANCE',
          userId
        }
      })

      return updatedRequest
    })
  }
}

export default new MaintenanceService()
