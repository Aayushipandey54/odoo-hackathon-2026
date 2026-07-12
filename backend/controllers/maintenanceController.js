import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import MaintenanceService from '../services/MaintenanceService.js'

export const getAllMaintenanceRequests = asyncHandler(async (req, res) => {
  const result = await MaintenanceService.getAll()
  res.status(200).json(new ApiResponse(200, result))
})

export const getMaintenanceRequestById = asyncHandler(async (req, res) => {
  const result = await MaintenanceService.getById(req.params.id)
  res.status(200).json(new ApiResponse(200, result))
})

export const createMaintenanceRequest = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const result = await MaintenanceService.create(req.body, userId)
  res.status(201).json(new ApiResponse(201, result, 'Maintenance request created successfully'))
})

export const approveMaintenanceRequest = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const result = await MaintenanceService.approve(req.params.id, userId)
  res.status(200).json(new ApiResponse(200, result, 'Maintenance request approved successfully'))
})

export const rejectMaintenanceRequest = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const { remarks } = req.body
  const result = await MaintenanceService.reject(req.params.id, remarks, userId)
  res.status(200).json(new ApiResponse(200, result, 'Maintenance request rejected successfully'))
})

export const assignTechnician = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const { technicianId } = req.body
  const result = await MaintenanceService.assignTechnician(req.params.id, technicianId, userId)
  res.status(200).json(new ApiResponse(200, result, 'Technician assigned successfully'))
})

export const startMaintenance = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const result = await MaintenanceService.startWork(req.params.id, userId)
  res.status(200).json(new ApiResponse(200, result, 'Maintenance service started successfully'))
})

export const resolveMaintenance = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const { repairNotes, resolutionSummary } = req.body
  const result = await MaintenanceService.resolve(req.params.id, { repairNotes, resolutionSummary }, userId)
  res.status(200).json(new ApiResponse(200, result, 'Maintenance request resolved successfully'))
})

export const closeMaintenance = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const { remarks } = req.body
  const result = await MaintenanceService.close(req.params.id, remarks, userId)
  res.status(200).json(new ApiResponse(200, result, 'Maintenance request closed successfully'))
})
