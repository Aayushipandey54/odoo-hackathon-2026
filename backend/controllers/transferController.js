import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import TransferService from '../services/TransferService.js'
import WorkflowValidator from '../validators/WorkflowValidator.js'
import { PERMISSIONS, hasPermission } from '../middleware/permissions.js'
import { UnauthorizedError } from '../utils/errors.js'

export const getAllTransfers = asyncHandler(async (req, res) => {
  // Check permission
  if (!hasPermission(req.user.role, PERMISSIONS.TRANSFER_READ)) {
    throw new UnauthorizedError('Insufficient permissions to view transfers')
  }

  const result = await TransferService.getAll()
  res.status(200).json(new ApiResponse(200, result, 'Transfers retrieved'))
})

export const getTransfersByStatus = asyncHandler(async (req, res) => {
  // Check permission
  if (!hasPermission(req.user.role, PERMISSIONS.TRANSFER_READ)) {
    throw new UnauthorizedError('Insufficient permissions to view transfers')
  }

  const { status } = req.query
  const result = await TransferService.getTransfersByStatus(status)
  res.status(200).json(new ApiResponse(200, result, 'Transfers filtered by status'))
})

export const getPendingTransfers = asyncHandler(async (req, res) => {
  // Check permission
  if (!hasPermission(req.user.role, PERMISSIONS.TRANSFER_APPROVE)) {
    throw new UnauthorizedError('Insufficient permissions to view pending transfers')
  }

  const userId = req.user?.id
  const result = await TransferService.getPendingTransfersForApprover(userId)
  res.status(200).json(new ApiResponse(200, result, 'Pending transfers for approval'))
})

export const requestTransfer = asyncHandler(async (req, res) => {
  // Check permission
  if (!hasPermission(req.user.role, PERMISSIONS.TRANSFER_CREATE)) {
    throw new UnauthorizedError('Insufficient permissions to request transfer')
  }

  // Validate input
  WorkflowValidator.validateTransferRequest(req.body)

  const userId = req.user?.id || 'system'
  const { assetId, fromEmployeeId, toEmployeeId, reason } = req.body

  const result = await TransferService.requestTransfer(
    assetId,
    fromEmployeeId,
    toEmployeeId,
    reason,
    userId
  )

  res.status(201).json(new ApiResponse(201, result, 'Transfer requested successfully'))
})

export const approveTransfer = asyncHandler(async (req, res) => {
  // Check permission
  if (!hasPermission(req.user.role, PERMISSIONS.TRANSFER_APPROVE)) {
    throw new UnauthorizedError('Insufficient permissions to approve transfer')
  }

  // Validate input
  WorkflowValidator.validateTransferApprovalRequest(req.body)

  const userId = req.user?.id || 'system'
  const transferId = req.params.id
  const { comments } = req.body

  const result = await TransferService.approveTransfer(transferId, userId, comments)

  res.status(200).json(new ApiResponse(200, result, 'Transfer approved successfully'))
})

export const rejectTransfer = asyncHandler(async (req, res) => {
  // Check permission
  if (!hasPermission(req.user.role, PERMISSIONS.TRANSFER_REJECT)) {
    throw new UnauthorizedError('Insufficient permissions to reject transfer')
  }

  // Validate input
  WorkflowValidator.validateTransferRejectionRequest(req.body)

  const userId = req.user?.id || 'system'
  const transferId = req.params.id
  const { reason } = req.body

  const result = await TransferService.rejectTransfer(transferId, userId, reason)

  res.status(200).json(new ApiResponse(200, result, 'Transfer rejected successfully'))
})
