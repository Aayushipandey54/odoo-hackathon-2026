import { prisma } from '../core/connection.js'
import { NotFoundError } from '../utils/errors.js'

/**
 * ComplianceService — Generates compliance reports and audit timelines.
 *
 * Reports are generated dynamically (not stored) to always reflect real-time data.
 * Timeline is pulled from the immutable ActivityLog.
 */
export class ComplianceService {

  /**
   * Generate a full compliance report for an audit cycle.
   */
  async generateReport(auditId) {
    const audit = await prisma.auditCycle.findUnique({
      where: { id: auditId },
      include: { department: true }
    })

    if (!audit || audit.deletedAt) {
      throw new NotFoundError(`Audit cycle not found for id "${auditId}"`)
    }

    // Aggregate verification stats
    const items = await prisma.auditItem.findMany({
      where: { auditCycleId: auditId, deletedAt: null },
      include: {
        asset: {
          select: { id: true, name: true, assetNumber: true, tag: true, status: true, condition: true, assigneeId: true }
        }
      }
    })

    const totalAssets = items.length
    const verified = items.filter(i => i.verification === 'VERIFIED').length
    const missing = items.filter(i => i.verification === 'MISSING').length
    const damaged = items.filter(i => i.verification === 'DAMAGED').length
    const notFound = items.filter(i => i.verification === 'NOT_FOUND').length
    const pending = items.filter(i => i.verification === null).length

    const complianceRate = totalAssets > 0
      ? parseFloat(((verified / totalAssets) * 100).toFixed(1))
      : 0

    // Calculate audit duration
    let durationMs = null
    let durationHuman = null
    if (audit.startedAt) {
      const end = audit.completedAt || new Date()
      durationMs = end.getTime() - audit.startedAt.getTime()
      const hours = Math.floor(durationMs / 3600000)
      const minutes = Math.floor((durationMs % 3600000) / 60000)
      durationHuman = `${hours}h ${minutes}m`
    }

    // Discrepancy summary
    const discrepancies = await prisma.auditDiscrepancy.findMany({
      where: { auditCycleId: auditId, deletedAt: null },
      orderBy: { createdAt: 'desc' }
    })

    const openDiscrepancies = discrepancies.filter(d => d.status === 'OPEN').length
    const resolvedDiscrepancies = discrepancies.filter(d => d.status === 'RESOLVED' || d.status === 'CLOSED').length

    // Build categorized item lists
    const missingAssets = items.filter(i => i.verification === 'MISSING' || i.verification === 'NOT_FOUND').map(i => ({
      assetNumber: i.asset.assetNumber,
      name: i.asset.name,
      expectedLocation: i.expectedLocation,
      remarks: i.remarks
    }))

    const damagedAssets = items.filter(i => i.verification === 'DAMAGED').map(i => ({
      assetNumber: i.asset.assetNumber,
      name: i.asset.name,
      expectedLocation: i.expectedLocation,
      remarks: i.remarks
    }))

    return {
      audit: {
        id: audit.id,
        name: audit.name,
        status: audit.status,
        department: audit.department.name,
        startDate: audit.startDate,
        endDate: audit.endDate,
        startedAt: audit.startedAt,
        completedAt: audit.completedAt,
        auditorNames: audit.auditorNames
      },
      summary: {
        totalAssets,
        verified,
        missing,
        damaged,
        notFound,
        pending,
        complianceRate,
        durationMs,
        durationHuman
      },
      discrepancies: {
        total: discrepancies.length,
        open: openDiscrepancies,
        resolved: resolvedDiscrepancies,
        items: discrepancies
      },
      flaggedAssets: {
        missing: missingAssets,
        damaged: damagedAssets
      }
    }
  }

  /**
   * Get the immutable activity timeline for an audit cycle.
   */
  async getTimeline(auditId) {
    const audit = await prisma.auditCycle.findUnique({ where: { id: auditId } })
    if (!audit || audit.deletedAt) {
      throw new NotFoundError(`Audit cycle not found for id "${auditId}"`)
    }

    // Pull all activity logs related to this audit
    const timeline = await prisma.activityLog.findMany({
      where: {
        entityId: auditId,
        entityType: 'AUDIT',
        deletedAt: null
      },
      orderBy: { createdAt: 'asc' }
    })

    // Also pull item-level events (verifications)
    const auditItemIds = await prisma.auditItem.findMany({
      where: { auditCycleId: auditId },
      select: { id: true }
    })
    const itemIds = auditItemIds.map(i => i.id)

    let itemTimeline = []
    if (itemIds.length > 0) {
      itemTimeline = await prisma.activityLog.findMany({
        where: {
          entityId: { in: itemIds },
          entityType: { in: ['AUDIT_ITEM', 'AUDIT_DISCREPANCY'] },
          deletedAt: null
        },
        orderBy: { createdAt: 'asc' }
      })
    }

    // Merge and sort chronologically
    const combined = [...timeline, ...itemTimeline].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    )

    return combined
  }
}

export default new ComplianceService()
