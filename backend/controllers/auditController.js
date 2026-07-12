import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import AuditService from '../services/AuditService.js'

export const getAllAudits = asyncHandler(async (req, res) => {
  const result = await AuditService.getAll()
  res.status(200).json(new ApiResponse(200, result))
})

export const createAuditCycle = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const result = await AuditService.create(req.body, userId)
  res.status(201).json(new ApiResponse(201, result, 'Audit cycle created successfully'))
})

export const verifyAuditItem = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const result = await AuditService.verifyItem(req.body, userId)
  res.status(201).json(new ApiResponse(201, result, 'Audit item verified successfully'))
})

export const closeAuditCycle = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const result = await AuditService.closeAudit(req.params.id, userId)
  res.status(200).json(new ApiResponse(200, result, 'Audit cycle closed successfully'))
})
