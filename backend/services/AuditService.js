import AuditRepository from '../repositories/AuditRepository.js'
import AuditItemRepository from '../repositories/AuditItemRepository.js'
import ActivityLogRepository from '../repositories/ActivityLogRepository.js'
import NotificationRepository from '../repositories/NotificationRepository.js'
import { prisma } from '../core/connection.js'

export class AuditService {
  async getAll() {
    return AuditRepository.findAll({}, {
      include: { department: true, items: { include: { asset: true } } }
    })
  }

  async create(data, userId) {
    const audit = await AuditRepository.create(data)
    await ActivityLogRepository.create({
      action: 'AUDIT_CREATED',
      details: `Audit cycle ${audit.name} created`,
      entityId: audit.id,
      entityType: 'AUDIT',
      userId
    })
    return audit
  }

  async verifyItem(data, userId) {
    const item = await AuditItemRepository.create(data)
    return item
  }

  async closeAudit(id, userId) {
    return await prisma.$transaction(async (tx) => {
      const audit = await tx.auditCycle.update({
        where: { id },
        data: { isClosed: true },
        include: { items: true }
      })

      const discrepancies = audit.items.filter(i => i.verification !== 'VERIFIED')
      if (discrepancies.length > 0) {
        await tx.notification.create({
          data: {
            type: 'AUDIT',
            message: `${discrepancies.length} assets flagged - discrepancy report generated automatically`
          }
        })
      }

      await tx.activityLog.create({
        data: {
          action: 'AUDIT_CLOSED',
          details: `Audit cycle ${id} closed`,
          entityId: id,
          entityType: 'AUDIT',
          userId
        }
      })

      return audit
    })
  }
}

export default new AuditService()
