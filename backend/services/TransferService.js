import TransferRepository from '../repositories/TransferRepository.js'
import ActivityLogRepository from '../repositories/ActivityLogRepository.js'
import AssetRepository from '../repositories/AssetRepository.js'
import AllocationService from './AllocationService.js'
import { prisma } from '../core/connection.js'

export class TransferService {
  async getAll() {
    return TransferRepository.findAll({}, {
      include: { asset: true, fromEmployee: true, toEmployee: true }
    })
  }

  async requestTransfer(assetId, fromEmployeeId, toEmployeeId, reason, userId) {
    const request = await TransferRepository.create({
      assetId, fromEmployeeId, toEmployeeId, reason, status: 'PENDING'
    })

    await ActivityLogRepository.create({
      action: 'TRANSFER_REQUESTED',
      details: `Transfer requested for asset ${assetId}`,
      entityId: request.id,
      entityType: 'TRANSFER',
      userId
    })

    return request
  }

  async approveTransfer(requestId, userId) {
    return await prisma.$transaction(async (tx) => {
      const request = await tx.transferRequest.update({
        where: { id: requestId },
        data: { status: 'APPROVED' },
        include: { asset: true }
      })

      // Complete transfer: allocate to new employee
      await tx.asset.update({
        where: { id: request.assetId },
        data: { assigneeId: request.toEmployeeId }
      })

      // We should close old allocation and create new one, but for hackathon keeping simple
      await tx.assetAllocation.create({
        data: { assetId: request.assetId, employeeId: request.toEmployeeId }
      })

      await tx.activityLog.create({
        data: {
          action: 'TRANSFER_APPROVED',
          details: `Transfer approved for asset ${request.asset.tag}`,
          entityId: request.id,
          entityType: 'TRANSFER',
          userId
        }
      })
      
      return request
    })
  }
}

export default new TransferService()
