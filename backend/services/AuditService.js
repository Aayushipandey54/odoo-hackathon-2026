import AuditRepository from '../repositories/AuditRepository.js'
import AuditItemRepository from '../repositories/AuditItemRepository.js'
import AuditDiscrepancyRepository from '../repositories/AuditDiscrepancyRepository.js'
import ActivityLogRepository from '../repositories/ActivityLogRepository.js'
import NotificationRepository from '../repositories/NotificationRepository.js'
import { prisma } from '../core/connection.js'
import { NotFoundError, ValidationError } from '../utils/errors.js'

/**
 * AuditService — Core state machine for Audit Cycles.
 *
 * State transitions:
 *   PLANNED → ACTIVE → COMPLETED
 *   PLANNED → CANCELLED
 *   ACTIVE  → CANCELLED
 *
 * Business logic lives here. Controllers never contain logic.
 */
export class AuditService {

  // ─── Read Operations ─────────────────────────────────────────────

  async getAll(filters = {}) {
    const where = { deletedAt: null }
    if (filters.status) where.status = filters.status
    if (filters.departmentId) where.departmentId = filters.departmentId

    return prisma.auditCycle.findMany({
      where,
      include: {
        department: true,
        _count: { select: { items: true, discrepancies: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getById(id) {
    const audit = await prisma.auditCycle.findUnique({
      where: { id },
      include: {
        department: true,
        items: {
          include: { asset: { select: { id: true, name: true, assetNumber: true, tag: true, status: true, condition: true } } },
          orderBy: { createdAt: 'asc' }
        },
        discrepancies: { orderBy: { createdAt: 'desc' } },
        _count: { select: { items: true, discrepancies: true } }
      }
    })
    if (!audit || audit.deletedAt) {
      throw new NotFoundError(`Audit cycle not found for id "${id}"`)
    }
    return audit
  }

  // ─── Create ──────────────────────────────────────────────────────

  async create(data, userId) {
    const { name, departmentId, startDate, endDate, auditorNames } = data

    if (!name || !departmentId || !startDate || !endDate || !auditorNames) {
      throw new ValidationError('Missing required fields: name, departmentId, startDate, endDate, auditorNames')
    }

    if (new Date(endDate) <= new Date(startDate)) {
      throw new ValidationError('endDate must be after startDate')
    }

    return await prisma.$transaction(async (tx) => {
      // Create the audit cycle
      const audit = await tx.auditCycle.create({
        data: {
          name,
          departmentId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          auditorNames,
          status: 'PLANNED'
        },
        include: { department: true }
      })

      // Auto-populate audit items from all assets in the department
      const assets = await tx.asset.findMany({
        where: { departmentId, deletedAt: null },
        include: { location: true }
      })

      if (assets.length > 0) {
        await tx.auditItem.createMany({
          data: assets.map(asset => ({
            auditCycleId: audit.id,
            assetId: asset.id,
            expectedLocation: asset.location?.name || 'Unknown'
          }))
        })
      }

      // Immutable activity log
      await tx.activityLog.create({
        data: {
          action: 'AUDIT_CREATED',
          details: `Audit cycle "${audit.name}" created with ${assets.length} assets for department ${audit.department.name}`,
          entityId: audit.id,
          entityType: 'AUDIT',
          userId
        }
      })

      return { ...audit, itemCount: assets.length }
    })
  }

  // ─── Start Audit ─────────────────────────────────────────────────

  async startAudit(id, userId) {
    const audit = await this._findAuditOrThrow(id)

    if (audit.status !== 'PLANNED') {
      throw new ValidationError(`Cannot start audit. Current status is "${audit.status}". Only PLANNED audits can be started.`)
    }

    return await prisma.$transaction(async (tx) => {
      const updated = await tx.auditCycle.update({
        where: { id },
        data: { status: 'ACTIVE', startedAt: new Date() },
        include: { department: true, _count: { select: { items: true } } }
      })

      await tx.activityLog.create({
        data: {
          action: 'AUDIT_STARTED',
          details: `Audit cycle "${updated.name}" started`,
          entityId: id,
          entityType: 'AUDIT',
          userId
        }
      })

      return updated
    })
  }

  // ─── Complete Audit ──────────────────────────────────────────────

  async completeAudit(id, userId) {
    const audit = await this._findAuditOrThrow(id)

    if (audit.status !== 'ACTIVE') {
      throw new ValidationError(`Cannot complete audit. Current status is "${audit.status}". Only ACTIVE audits can be completed.`)
    }

    return await prisma.$transaction(async (tx) => {
      // Check for unverified items
      const unverifiedCount = await tx.auditItem.count({
        where: { auditCycleId: id, verification: null, deletedAt: null }
      })

      const totalItems = await tx.auditItem.count({
        where: { auditCycleId: id, deletedAt: null }
      })

      const verifiedItems = await tx.auditItem.count({
        where: { auditCycleId: id, verification: 'VERIFIED', deletedAt: null }
      })

      const missingItems = await tx.auditItem.count({
        where: { auditCycleId: id, verification: 'MISSING', deletedAt: null }
      })

      const damagedItems = await tx.auditItem.count({
        where: { auditCycleId: id, verification: 'DAMAGED', deletedAt: null }
      })

      const notFoundItems = await tx.auditItem.count({
        where: { auditCycleId: id, verification: 'NOT_FOUND', deletedAt: null }
      })

      const complianceRate = totalItems > 0 ? ((verifiedItems / totalItems) * 100).toFixed(1) : '0.0'

      const summaryText = `Total: ${totalItems} | Verified: ${verifiedItems} | Missing: ${missingItems} | Damaged: ${damagedItems} | Not Found: ${notFoundItems} | Pending: ${unverifiedCount} | Compliance: ${complianceRate}%`

      const updated = await tx.auditCycle.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          isClosed: true,
          completedAt: new Date(),
          summary: summaryText
        },
        include: { department: true }
      })

      // Create notification if discrepancies exist
      const discrepancyCount = missingItems + damagedItems + notFoundItems
      if (discrepancyCount > 0) {
        await tx.notification.create({
          data: {
            type: 'AUDIT',
            message: `Audit "${updated.name}" completed with ${discrepancyCount} discrepancies. Compliance rate: ${complianceRate}%`
          }
        })
      }

      await tx.activityLog.create({
        data: {
          action: 'AUDIT_COMPLETED',
          details: `Audit cycle "${updated.name}" completed. ${summaryText}`,
          entityId: id,
          entityType: 'AUDIT',
          userId
        }
      })

      return updated
    })
  }

  // ─── Cancel Audit ────────────────────────────────────────────────

  async cancelAudit(id, userId, reason) {
    const audit = await this._findAuditOrThrow(id)

    if (audit.status === 'COMPLETED' || audit.status === 'CANCELLED') {
      throw new ValidationError(`Cannot cancel audit. Current status is "${audit.status}".`)
    }

    return await prisma.$transaction(async (tx) => {
      const updated = await tx.auditCycle.update({
        where: { id },
        data: { status: 'CANCELLED', isClosed: true },
        include: { department: true }
      })

      await tx.activityLog.create({
        data: {
          action: 'AUDIT_CANCELLED',
          details: `Audit cycle "${updated.name}" cancelled. Reason: ${reason || 'No reason provided'}`,
          entityId: id,
          entityType: 'AUDIT',
          userId
        }
      })

      return updated
    })
  }

  // ─── Helpers ─────────────────────────────────────────────────────

  async _findAuditOrThrow(id) {
    const audit = await prisma.auditCycle.findUnique({ where: { id } })
    if (!audit || audit.deletedAt) {
      throw new NotFoundError(`Audit cycle not found for id "${id}"`)
    }
    return audit
  }
}

export default new AuditService()
