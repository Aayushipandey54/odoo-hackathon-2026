import AllocationRepository from '../repositories/AllocationRepository.js'
import AssetRepository from '../repositories/AssetRepository.js'
import ActivityLogRepository from '../repositories/ActivityLogRepository.js'
import NotificationService from './NotificationService.js'
import TimelineService from './TimelineService.js'
import WorkflowEngine from './WorkflowEngine.js'
import DomainEventService from './DomainEventService.js'
import { ValidationError } from '../utils/errors.js'
import { WORKFLOW_TYPES, DOMAIN_EVENTS, TIMELINE_EVENTS } from '../constants/workflowTypes.js'

export class AllocationService {
  /**
   * Get all allocations
   * @returns {Promise} array of allocations
   */
  async getAll() {
    return AllocationRepository.findAll({}, {
      include: { asset: true, employee: true }
    })
  }

  /**
   * Get active allocations for an employee
   * @param {string} employeeId - Employee ID
   * @returns {Promise} array of active allocations
   */
  async getActiveAllocations(employeeId) {
    return await AllocationRepository.findAll({
      where: {
        employeeId,
        returnedAt: null
      }
    }, {
      include: { asset: true }
    })
  }

  /**
   * Allocate asset to employee
   * @param {string} assetId - Asset ID
   * @param {string} employeeId - Employee ID
   * @param {string} userId - User ID performing allocation
   * @returns {Promise} created allocation
   */
  async allocate(assetId, employeeId, userId) {
    return await WorkflowEngine.executeWorkflow(
      WORKFLOW_TYPES.ALLOCATION,
      { assetId, employeeId },
      userId,
      async (tx) => {
        // Double-check allocation (race condition protection)
        const existingActive = await tx.assetAllocation.findFirst({
          where: {
            assetId,
            returnedAt: null
          }
        })

        if (existingActive) {
          throw new ValidationError(
            'Asset is already allocated. Submit a transfer request instead.'
          )
        }

        // Fetch asset and employee for details
        const asset = await tx.asset.findUnique({
          where: { id: assetId },
          include: { category: true }
        })

        const employee = await tx.employee.findUnique({
          where: { id: employeeId },
          include: { department: true }
        })

        if (!asset || !employee) {
          throw new ValidationError('Asset or employee not found')
        }

        // Create allocation
        const allocation = await tx.assetAllocation.create({
          data: {
            assetId,
            employeeId,
            allocatedAt: new Date()
          }
        })

        // Update asset status
        await tx.asset.update({
          where: { id: assetId },
          data: {
            status: 'ALLOCATED',
            assigneeId: employeeId
          }
        })

        // Create audit log
        await tx.activityLog.create({
          data: {
            action: 'ASSET_ALLOCATED',
            details: `Asset ${asset.tag} allocated to ${employee.name}`,
            entityId: assetId,
            entityType: 'ASSET',
            userId,
            metadata: JSON.stringify({
              assetTag: asset.tag,
              employeeName: employee.name,
              department: employee.department.name
            })
          }
        })

        // Create timeline event (within transaction)
        await tx.assetTimeline.create({
          data: {
            assetId,
            event: TIMELINE_EVENTS.ASSET_ALLOCATED,
            description: `Allocated to ${employee.name} (${employee.department.name})`,
            details: JSON.stringify({
              employeeId,
              employeeName: employee.name,
              departmentId: employee.departmentId
            }),
            performedBy: userId
          }
        })

        return { allocation, asset, employee }
      }
    ).then(async (result) => {
      // Send notification (outside transaction)
      await NotificationService.createNotification({
        userId: result.employee.id,
        type: 'ALLOCATION',
        message: `Asset "${result.asset.name}" has been allocated to you`,
        metadata: {
          assetId: result.asset.id,
          assetTag: result.asset.tag,
          allocationId: result.allocation.id
        }
      })

      // Emit domain event (outside transaction)
      await DomainEventService.emit(
        DOMAIN_EVENTS.ASSET_ALLOCATED,
        {
          assetId: result.asset.id,
          assetTag: result.asset.tag,
          employeeId: result.employee.id,
          employeeName: result.employee.name,
          allocationId: result.allocation.id
        },
        { userId }
      )

      return result.allocation
    })
  }

  /**
   * Return asset from employee
   * @param {string} allocationId - Allocation ID
   * @param {string} condition - Asset condition upon return
   * @param {string} userId - User ID performing return
   * @returns {Promise} updated allocation
   */
  async returnAsset(allocationId, condition = 'GOOD', userId) {
    return await WorkflowEngine.executeWorkflow(
      WORKFLOW_TYPES.RETURN,
      { allocationId },
      userId,
      async (tx) => {
        const allocation = await tx.assetAllocation.findUnique({
          where: { id: allocationId },
          include: {
            asset: { include: { category: true } },
            employee: { include: { department: true } }
          }
        })

        if (!allocation) {
          throw new ValidationError(`Allocation not found: ${allocationId}`)
        }

        if (allocation.returnedAt) {
          throw new ValidationError('Asset already returned')
        }

        // Update allocation with return info
        const updatedAllocation = await tx.assetAllocation.update({
          where: { id: allocationId },
          data: {
            returnedAt: new Date(),
            conditionOnReturn: condition
          }
        })

        // Update asset status
        await tx.asset.update({
          where: { id: allocation.assetId },
          data: {
            status: 'AVAILABLE',
            assigneeId: null,
            condition
          }
        })

        // Create audit log
        await tx.activityLog.create({
          data: {
            action: 'ASSET_RETURNED',
            details: `Asset ${allocation.asset.tag} returned by ${allocation.employee.name} in ${condition} condition`,
            entityId: allocation.assetId,
            entityType: 'ASSET',
            userId,
            metadata: JSON.stringify({
              assetTag: allocation.asset.tag,
              employeeName: allocation.employee.name,
              condition,
              allocationDays: Math.floor(
                (new Date() - allocation.allocatedAt) / (1000 * 60 * 60 * 24)
              )
            })
          }
        })

        // Create timeline event
        await tx.assetTimeline.create({
          data: {
            assetId: allocation.assetId,
            event: TIMELINE_EVENTS.ASSET_RETURNED,
            description: `Returned by ${allocation.employee.name} in ${condition} condition`,
            details: JSON.stringify({
              employeeId: allocation.employeeId,
              employeeName: allocation.employee.name,
              condition,
              returnedDate: new Date()
            }),
            performedBy: userId
          }
        })

        return { allocation: updatedAllocation, asset: allocation.asset, employee: allocation.employee }
      }
    ).then(async (result) => {
      // Send notification
      await NotificationService.createNotification({
        userId: result.employee.userId,
        type: 'ALLOCATION',
        message: `Asset "${result.asset.name}" return confirmed in ${result.allocation.conditionOnReturn} condition`,
        metadata: {
          assetId: result.asset.id,
          allocationId: result.allocation.id
        }
      })

      // Emit domain event
      await DomainEventService.emit(
        DOMAIN_EVENTS.ASSET_RETURNED,
        {
          assetId: result.asset.id,
          assetTag: result.asset.tag,
          employeeId: result.employee.id,
          condition: result.allocation.conditionOnReturn,
          allocationId: result.allocation.id
        },
        { userId }
      )

      return result.allocation
    })
  }
}

export default new AllocationService()
