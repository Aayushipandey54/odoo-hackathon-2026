import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import AuditService from '../services/AuditService.js'
import VerificationService from '../services/VerificationService.js'
import ComplianceService from '../services/ComplianceService.js'

/**
 * POST /api/audits
 * Create a new audit cycle. Auto-populates items from department assets.
 */
export const createAudit = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const result = await AuditService.create(req.body, userId)
  res.status(201).json(new ApiResponse(201, result, 'Audit cycle created successfully'))
})

/**
 * GET /api/audits
 * List all audit cycles with optional filters (?status=ACTIVE&departmentId=xxx).
 */
export const getAllAudits = asyncHandler(async (req, res) => {
  const filters = {}
  if (req.query.status) filters.status = req.query.status
  if (req.query.departmentId) filters.departmentId = req.query.departmentId
  const result = await AuditService.getAll(filters)
  res.status(200).json(new ApiResponse(200, result))
})

/**
 * GET /api/audits/:id
 * Get a single audit cycle with all items, discrepancies, and counts.
 */
export const getAuditById = asyncHandler(async (req, res) => {
  const result = await AuditService.getById(req.params.id)
  res.status(200).json(new ApiResponse(200, result))
})

/**
 * POST /api/audits/:id/start
 * Transition audit from PLANNED → ACTIVE.
 */
export const startAudit = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const result = await AuditService.startAudit(req.params.id, userId)
  res.status(200).json(new ApiResponse(200, result, 'Audit started successfully'))
})

/**
 * POST /api/audits/:id/verify
 * Verify a single asset within an active audit.
 * Body: { assetId, verification, remarks?, actualLocation? }
 */
export const verifyAsset = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const result = await VerificationService.verifyAsset(req.params.id, req.body, userId)
  res.status(200).json(new ApiResponse(200, result, 'Asset verification recorded'))
})

/**
 * POST /api/audits/:id/complete
 * Transition audit from ACTIVE → COMPLETED. Generates summary.
 */
export const completeAudit = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const result = await AuditService.completeAudit(req.params.id, userId)
  res.status(200).json(new ApiResponse(200, result, 'Audit completed successfully'))
})

/**
 * POST /api/audits/:id/cancel
 * Cancel an audit (PLANNED or ACTIVE → CANCELLED).
 */
export const cancelAudit = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const result = await AuditService.cancelAudit(req.params.id, userId, req.body.reason)
  res.status(200).json(new ApiResponse(200, result, 'Audit cancelled'))
})

/**
 * GET /api/audits/:id/report
 * Generate a dynamic compliance report for an audit cycle.
 */
export const getAuditReport = asyncHandler(async (req, res) => {
  const result = await ComplianceService.generateReport(req.params.id)
  res.status(200).json(new ApiResponse(200, result, 'Compliance report generated'))
})

/**
 * GET /api/audits/:id/timeline
 * Get the immutable activity timeline for an audit cycle.
 */
export const getAuditTimeline = asyncHandler(async (req, res) => {
  const result = await ComplianceService.getTimeline(req.params.id)
  res.status(200).json(new ApiResponse(200, result, 'Audit timeline retrieved'))
})
