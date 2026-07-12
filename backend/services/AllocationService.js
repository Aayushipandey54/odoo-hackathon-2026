import AllocationRepository from '../repositories/AllocationRepository.js'
import AssetRepository from '../repositories/AssetRepository.js'
import ActivityLogRepository from '../repositories/ActivityLogRepository.js'
import { ValidationError } from '../utils/errors.js'
import { prisma } from '../core/connection.js'

export class AllocationService {
  async getAll() {
    return AllocationRepository.findAll({}, {
      include: { asset: true, employee: true }
    })
  }

  async allocate(assetId, employeeId, userId) {
    // BUSINESS RULE: Prevent double allocation
    const asset = await AssetRepository.findById(assetId)
    if (asset.status === 'ALLOCATED' && asset.assigneeId) {
      throw new ValidationError(`Already Allocated to ${asset.assigneeId}. Direct re-allocation is blocked - submit a transfer request.`)
    }

    return await prisma.$transaction(async (tx) => {
      const allocation = await tx.assetAllocation.create({
        data: { assetId, employeeId }
      })

      await tx.asset.update({
        where: { id: assetId },
        data: { status: 'ALLOCATED', assigneeId: employeeId }
      })

      await tx.activityLog.create({
        data: {
          action: 'ASSET_ALLOCATED',
          details: `Asset ${asset.tag} allocated`,
          entityId: assetId,
          entityType: 'ASSET',
          userId
        }
      })

      return allocation
    })
  }

  async returnAsset(allocationId, condition, userId) {
    return await prisma.$transaction(async (tx) => {
      const allocation = await tx.assetAllocation.findUnique({ where: { id: allocationId }, include: { asset: true } })
      
      const updatedAllocation = await tx.assetAllocation.update({
        where: { id: allocationId },
        data: { returnedAt: new Date(), conditionOnReturn: condition }
      })

      await tx.asset.update({
        where: { id: allocation.assetId },
        data: { status: 'AVAILABLE', assigneeId: null, condition }
      })

      await tx.activityLog.create({
        data: {
          action: 'ASSET_RETURNED',
          details: `Asset ${allocation.asset.tag} returned with condition ${condition}`,
          entityId: allocation.assetId,
          entityType: 'ASSET',
          userId
        }
      })

      return updatedAllocation
    })
  }
}

export default new AllocationService()
