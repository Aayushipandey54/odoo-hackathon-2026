/**
 * Workflow Engine Service
 * Orchestrates all asset lifecycle workflows
 * Ensures atomicity, validates preconditions, emits events
 * Used for: Allocation, Transfer, Return, and future workflows
 */

import { prisma } from '../core/connection.js'
import StateMachine from './StateMachine.js'
import DomainEventService from './DomainEventService.js'
import { ValidationError } from '../utils/errors.js'

export class WorkflowEngine {
  /**
   * Workflow types
   */
  static WORKFLOW_TYPES = {
    ALLOCATION: 'ALLOCATION',
    RETURN: 'RETURN',
    TRANSFER: 'TRANSFER',
    APPROVAL: 'APPROVAL'
  }

  /**
   * Execute a workflow with full orchestration
   * @param {string} workflowType - Type of workflow
   * @param {Object} data - Workflow input data
   * @param {string} userId - User executing workflow
   * @param {Function} executorFn - Function that executes the workflow
   * @returns {Object} - Workflow result
   * @throws {Error} - If workflow fails
   */
  async executeWorkflow(workflowType, data, userId, executorFn) {
    const workflowId = this.generateWorkflowId()
    const startTime = Date.now()

    try {
      // Step 1: Validate preconditions (outside transaction)
      await this.validatePreconditions(workflowType, data)

      // Step 2: Execute in transaction
      const result = await prisma.$transaction(
        async (tx) => {
          return await executorFn(tx)
        },
        {
          isolationLevel: 'Serializable',
          maxWait: 5000,
          timeout: 10000
        }
      )

      // Step 3: Emit domain event (outside transaction)
      this.emitWorkflowEvent(workflowType, data, result, userId)

      const duration = Date.now() - startTime
      console.log(
        `[WorkflowEngine] ${workflowType} completed in ${duration}ms (ID: ${workflowId})`
      )

      return {
        workflowId,
        success: true,
        result,
        duration,
        timestamp: new Date()
      }
    } catch (error) {
      const duration = Date.now() - startTime

      // Log workflow failure
      console.error(
        `[WorkflowEngine] ${workflowType} failed in ${duration}ms (ID: ${workflowId}):`,
        error.message
      )

      // Emit workflow failed event
      DomainEventService.emit('WORKFLOW_FAILED', {
        aggregateId: data.assetId || data.entityId,
        userId,
        data: {
          workflowType,
          error: error.message,
          duration
        }
      })

      throw error
    }
  }

  /**
   * Validate workflow preconditions
   * @param {string} workflowType - Workflow type
   * @param {Object} data - Workflow data
   * @throws {ValidationError} - If preconditions not met
   */
  async validatePreconditions(workflowType, data) {
    switch (workflowType) {
      case this.WORKFLOW_TYPES.ALLOCATION:
        return this.validateAllocationPreconditions(data)
      case this.WORKFLOW_TYPES.RETURN:
        return this.validateReturnPreconditions(data)
      case this.WORKFLOW_TYPES.TRANSFER:
        return this.validateTransferPreconditions(data)
      case this.WORKFLOW_TYPES.APPROVAL:
        return this.validateApprovalPreconditions(data)
      default:
        throw new ValidationError(`Unknown workflow type: ${workflowType}`)
    }
  }

  /**
   * Validate allocation preconditions
   */
  async validateAllocationPreconditions(data) {
    const { assetId, employeeId } = data

    // Validate IDs provided
    if (!assetId || !employeeId) {
      throw new ValidationError('assetId and employeeId are required')
    }

    // Fetch asset
    const asset = await prisma.asset.findUnique({
      where: { id: assetId }
    })

    if (!asset) {
      throw new ValidationError(`Asset not found: ${assetId}`)
    }

    // Check asset state
    StateMachine.validateCanAllocate(asset.status)

    // Fetch employee
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    })

    if (!employee) {
      throw new ValidationError(`Employee not found: ${employeeId}`)
    }

    // Validate employee is active (optional - check if deleted)
    if (employee.deletedAt) {
      throw new ValidationError(`Employee is inactive: ${employeeId}`)
    }
  }

  /**
   * Validate return preconditions
   */
  async validateReturnPreconditions(data) {
    const { allocationId } = data

    if (!allocationId) {
      throw new ValidationError('allocationId is required')
    }

    const allocation = await prisma.assetAllocation.findUnique({
      where: { id: allocationId },
      include: { asset: true }
    })

    if (!allocation) {
      throw new ValidationError(`Allocation not found: ${allocationId}`)
    }

    if (allocation.returnedAt) {
      throw new ValidationError(`Allocation already returned on ${allocation.returnedAt}`)
    }

    // Check asset state
    StateMachine.validateCanReturn(allocation.asset.status)
  }

  /**
   * Validate transfer preconditions
   */
  async validateTransferPreconditions(data) {
    const { assetId, fromEmployeeId, toEmployeeId } = data

    if (!assetId || !fromEmployeeId || !toEmployeeId) {
      throw new ValidationError(
        'assetId, fromEmployeeId, and toEmployeeId are required'
      )
    }

    if (fromEmployeeId === toEmployeeId) {
      throw new ValidationError(
        'Cannot transfer to same employee'
      )
    }

    // Fetch asset
    const asset = await prisma.asset.findUnique({
      where: { id: assetId }
    })

    if (!asset) {
      throw new ValidationError(`Asset not found: ${assetId}`)
    }

    // Check asset state
    StateMachine.validateCanTransfer(asset.status)

    // Verify asset is assigned to fromEmployee
    if (asset.assigneeId !== fromEmployeeId) {
      throw new ValidationError(
        `Asset is not assigned to employee ${fromEmployeeId}`
      )
    }

    // Fetch target employee
    const toEmployee = await prisma.employee.findUnique({
      where: { id: toEmployeeId }
    })

    if (!toEmployee) {
      throw new ValidationError(`Target employee not found: ${toEmployeeId}`)
    }

    if (toEmployee.deletedAt) {
      throw new ValidationError(`Target employee is inactive: ${toEmployeeId}`)
    }
  }

  /**
   * Validate approval preconditions
   */
  async validateApprovalPreconditions(data) {
    const { requestId, approverId } = data

    if (!requestId || !approverId) {
      throw new ValidationError('requestId and approverId are required')
    }

    // Approver must exist and be active
    const approver = await prisma.employee.findUnique({
      where: { id: approverId }
    })

    if (!approver) {
      throw new ValidationError(`Approver not found: ${approverId}`)
    }

    if (approver.deletedAt) {
      throw new ValidationError(`Approver is inactive: ${approverId}`)
    }
  }

  /**
   * Emit workflow event based on workflow type
   * @private
   */
  emitWorkflowEvent(workflowType, data, result, userId) {
    let eventType = null
    let payload = null

    switch (workflowType) {
      case this.WORKFLOW_TYPES.ALLOCATION:
        eventType = DomainEventService.EVENT_TYPES.ASSET_ALLOCATED
        payload = {
          aggregateId: data.assetId,
          userId,
          data: { allocationId: result.id, employeeId: data.employeeId }
        }
        break

      case this.WORKFLOW_TYPES.RETURN:
        eventType = DomainEventService.EVENT_TYPES.ASSET_RETURNED
        payload = {
          aggregateId: data.assetId,
          userId,
          data: { allocationId: result.id, condition: data.condition }
        }
        break

      case this.WORKFLOW_TYPES.TRANSFER:
        eventType = DomainEventService.EVENT_TYPES.ASSET_TRANSFERRED
        payload = {
          aggregateId: data.assetId,
          userId,
          data: {
            transferId: result.id,
            fromEmployeeId: data.fromEmployeeId,
            toEmployeeId: data.toEmployeeId
          }
        }
        break

      case this.WORKFLOW_TYPES.APPROVAL:
        eventType = DomainEventService.EVENT_TYPES.APPROVAL_APPROVED
        payload = {
          aggregateId: data.requestId,
          userId,
          data: { approvalStatus: result.status }
        }
        break

      default:
        eventType = DomainEventService.EVENT_TYPES.WORKFLOW_COMPLETED
        payload = {
          aggregateId: data.assetId || data.entityId,
          userId,
          data: { workflowType, result }
        }
    }

    if (eventType && payload) {
      DomainEventService.emit(eventType, payload)
    }
  }

  /**
   * Generate unique workflow ID for tracking
   * @private
   */
  generateWorkflowId() {
    return `WF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Validate state transition with state machine
   */
  validateStateTransition(fromState, toState) {
    try {
      StateMachine.validateTransition(fromState, toState)
      return true
    } catch (error) {
      throw new ValidationError(error.message)
    }
  }

  /**
   * Get valid transitions from current state
   */
  getValidTransitions(currentState) {
    return StateMachine.getValidTransitions(currentState)
  }
}

export default new WorkflowEngine()
