import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import AllocationService from '../services/AllocationService.js'
import WorkflowValidator from '../validators/WorkflowValidator.js'
import { PERMISSIONS, hasPermission } from '../middleware/permissions.js'
import { UnauthorizedError } from '../utils/errors.js'

export const getAllAllocations = asyncHandler(async (req, res) => {
  // Check permission
  if (!hasPermission(req.user.role, PERMISSIONS.ALLOCATION_READ)) {
    throw new UnauthorizedError('Insufficient permissions to view allocations')
  }

  const result = await AllocationService.getAll()
  res.status(200).json(new ApiResponse(200, result, 'Allocations retrieved'))
})

export const allocateAsset = asyncHandler(async (req, res) => {
  // Check permission
  if (!hasPermission(req.user.role, PERMISSIONS.ALLOCATION_CREATE)) {
    throw new UnauthorizedError('Insufficient permissions to allocate assets')
  }

  // Validate input
  WorkflowValidator.validateAllocationRequest(req.body)

  const userId = req.user?.id || 'system'
  const { assetId, employeeId } = req.body

  const result = await AllocationService.allocate(assetId, employeeId, userId)

  res.status(201).json(new ApiResponse(201, result, 'Asset allocated successfully'))
})

export const returnAsset = asyncHandler(async (req, res) => {
  // Check permission (employees can return their own, managers can return any)
  if (!hasPermission(req.user.role, PERMISSIONS.ALLOCATION_READ)) {
    throw new UnauthorizedError('Insufficient permissions to return assets')
  }

  // Validate input
  WorkflowValidator.validateReturnRequest(req.body)

  const userId = req.user?.id || 'system'
  const { condition = 'GOOD' } = req.body
  const allocationId = req.params.id

  const result = await AllocationService.returnAsset(allocationId, condition, userId)

  res.status(200).json(new ApiResponse(200, result, 'Asset returned successfully'))
})
