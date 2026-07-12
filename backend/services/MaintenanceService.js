import MaintenanceRepository from '../repositories/MaintenanceRepository.js'
import ActivityLogRepository from '../repositories/ActivityLogRepository.js'
import AssetRepository from '../repositories/AssetRepository.js'
import { prisma } from '../core/connection.js'

export class MaintenanceService {
  async getAll() {
    return MaintenanceRepository.findAll({}, {
      include: { asset: true, technician: true }
    })
  }

  async create(data, userId) {
    const request = await MaintenanceRepository.create(data)
    
    await AssetRepository.update(data.assetId, { status: 'MAINTENANCE' })

    await ActivityLogRepository.create({
      action: 'MAINTENANCE_REQUESTED',
      details: `Maintenance requested for asset ${data.assetId}`,
      entityId: request.id,
      entityType: 'MAINTENANCE',
      userId
    })
    return request
  }

  async updateStatus(id, status, technicianId, userId) {
    return await prisma.$transaction(async (tx) => {
      const data = { status }
      if (technicianId) data.technicianId = technicianId
      if (status === 'RESOLVED') data.resolvedAt = new Date()

      const request = await tx.maintenanceRequest.update({
        where: { id },
        data,
        include: { asset: true }
      })

      if (status === 'RESOLVED') {
        await tx.asset.update({
          where: { id: request.assetId },
          data: { status: 'AVAILABLE' } // Assuming it becomes available
        })
      }

      await tx.activityLog.create({
        data: {
          action: 'MAINTENANCE_UPDATED',
          details: `Maintenance request ${id} updated to ${status}`,
          entityId: id,
          entityType: 'MAINTENANCE',
          userId
        }
      })

      return request
    })
  }
}

export default new MaintenanceService()
