import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import MaintenanceService from '../services/MaintenanceService.js'

export const getAllMaintenanceRequests = asyncHandler(async (req, res) => {
  const result = await MaintenanceService.getAll()
  res.status(200).json(new ApiResponse(200, result))
})

export const createMaintenanceRequest = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const result = await MaintenanceService.create(req.body, userId)
  res.status(201).json(new ApiResponse(201, result, 'Maintenance request created successfully'))
})

export const updateMaintenanceStatus = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const { status, technicianId } = req.body
  const result = await MaintenanceService.updateStatus(req.params.id, status, technicianId, userId)
  res.status(200).json(new ApiResponse(200, result, 'Maintenance request updated successfully'))
})
