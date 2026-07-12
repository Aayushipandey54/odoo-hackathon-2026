/**
 * Workflow Routes
 * Endpoints for workflow history, status, and pending workflows
 */

import express from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import TimelineService from '../services/TimelineService.js'
import TransferService from '../services/TransferService.js'
import { PERMISSIONS, hasPermission } from '../middleware/permissions.js'
import { UnauthorizedError, NotFoundError, ValidationError } from '../utils/errors.js'

const router = express.Router()

/**
 * GET /api/workflow/history/:assetId
 * Get workflow history for an asset
 */
router.get('/history/:assetId', asyncHandler(async (req, res) => {
  // Check permission
  if (!hasPermission(req.user.role, PERMISSIONS.WORKFLOW_READ)) {
    throw new UnauthorizedError('Insufficient permissions to view workflow history')
  }

  const { assetId } = req.params
  const { limit = 50, offset = 0 } = req.query

  if (!assetId) {
    throw new ValidationError('assetId is required')
  }

  const options = {
    limit: Math.min(parseInt(limit, 10) || 50, 100),
    offset: Math.max(0, parseInt(offset, 10) || 0)
  }

  const history = await TimelineService.getTimeline(assetId, options)

  res.status(200).json(new ApiResponse(200, history, 'Workflow history retrieved'))
}))

/**
 * GET /api/workflow/pending
 * Get pending workflows (approvals)
 */
router.get('/pending', asyncHandler(async (req, res) => {
  // Check permission
  if (!hasPermission(req.user.role, PERMISSIONS.APPROVAL_VIEW)) {
    throw new UnauthorizedError('Insufficient permissions to view pending approvals')
  }

  const userId = req.user?.id
  if (!userId) {
    throw new UnauthorizedError('User not found')
  }

  // Get pending transfers for this user (as approver)
  const pendingTransfers = await TransferService.getPendingTransfersForApprover(userId)

  // TODO: Add pending maintenance, bookings, etc. from future phases

  const pending = {
    transfers: pendingTransfers,
    total: pendingTransfers.length,
    timestamp: new Date()
  }

  res.status(200).json(new ApiResponse(200, pending, 'Pending workflows retrieved'))
}))

/**
 * GET /api/workflow/stats
 * Get workflow statistics
 */
router.get('/stats', asyncHandler(async (req, res) => {
  // Check permission
  if (!hasPermission(req.user.role, PERMISSIONS.WORKFLOW_READ)) {
    throw new UnauthorizedError('Insufficient permissions to view workflow stats')
  }

  // TODO: Implement workflow statistics
  // - Total allocations today
  // - Pending transfers
  // - Completed workflows
  // - Average approval time

  const stats = {
    allocationsToday: 0,
    pendingTransfers: 0,
    completedToday: 0,
    averageApprovalTime: 0
  }

  res.status(200).json(new ApiResponse(200, stats, 'Workflow statistics'))
}))

/**
 * GET /api/workflow/:workflowId
 * Get specific workflow status
 */
router.get('/:workflowId', asyncHandler(async (req, res) => {
  // Check permission
  if (!hasPermission(req.user.role, PERMISSIONS.WORKFLOW_READ)) {
    throw new UnauthorizedError('Insufficient permissions to view workflow')
  }

  const { workflowId } = req.params

  if (!workflowId) {
    throw new ValidationError('workflowId is required')
  }

  // TODO: Implement workflow detail retrieval
  // For now, return placeholder

  const workflow = {
    id: workflowId,
    status: 'PENDING',
    type: 'TRANSFER',
    createdAt: new Date(),
    message: 'Workflow details not yet fully implemented'
  }

  res.status(200).json(new ApiResponse(200, workflow, 'Workflow details'))
}))

export default router
