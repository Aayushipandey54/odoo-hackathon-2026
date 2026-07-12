/**
 * Resource Controller
 * Handles resource endpoints with RBAC and validation
 */

import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import ResourceService from '../services/ResourceService.js'
import AvailabilityService from '../services/AvailabilityService.js'
import BookingValidator from '../validators/BookingValidator.js'
import { hasPermission } from '../middleware/permissions.js'
import { NotFoundError } from '../utils/errors.js'

/**
 * Get all resources
 * GET /resources
 */
export const getAllResources = asyncHandler(async (req, res) => {
  const filters = BookingValidator.validateFilters(req.query)
  const result = await ResourceService.getAll(filters)
  res.status(200).json(new ApiResponse(200, result, 'Resources retrieved successfully'))
})

/**
 * Get active resources
 * GET /resources/active
 */
export const getActiveResources = asyncHandler(async (req, res) => {
  const filters = BookingValidator.validateFilters(req.query)
  const result = await ResourceService.getActiveResources(filters)
  res.status(200).json(new ApiResponse(200, result, 'Active resources retrieved successfully'))
})

/**
 * Create resource (admin only)
 * POST /resources
 */
export const createResource = asyncHandler(async (req, res) => {
  const userRole = req.user?.role || 'EMPLOYEE'

  // RBAC: Admin only
  if (!hasPermission(userRole, 'resource:create')) {
    return res.status(403).json(new ApiResponse(403, null, 'Insufficient permissions to create resources'))
  }

  BookingValidator.validateCreateResourceRequest(req.body)

  const result = await ResourceService.create(req.body)
  res.status(201).json(new ApiResponse(201, result, 'Resource created successfully'))
})

/**
 * Get resource by ID
 * GET /resources/:id
 */
export const getResourceById = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json(new ApiResponse(400, null, 'Resource ID is required'))
  }

  const result = await ResourceService.getById(id)

  if (!result) {
    throw new NotFoundError(`Resource ${id} not found`)
  }

  res.status(200).json(new ApiResponse(200, result, 'Resource retrieved successfully'))
})

/**
 * Update resource (admin only)
 * PUT /resources/:id
 */
export const updateResource = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userRole = req.user?.role || 'EMPLOYEE'

  // RBAC: Admin only
  if (!hasPermission(userRole, 'resource:update')) {
    return res.status(403).json(new ApiResponse(403, null, 'Insufficient permissions to update resources'))
  }

  BookingValidator.validateUpdateResourceRequest(req.body)

  const result = await ResourceService.update(id, req.body)
  res.status(200).json(new ApiResponse(200, result, 'Resource updated successfully'))
})

/**
 * Delete resource (admin only)
 * DELETE /resources/:id
 */
export const deleteResource = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userRole = req.user?.role || 'EMPLOYEE'

  // RBAC: Admin only
  if (!hasPermission(userRole, 'resource:delete')) {
    return res.status(403).json(new ApiResponse(403, null, 'Insufficient permissions to delete resources'))
  }

  await ResourceService.delete(id)
  res.status(200).json(new ApiResponse(200, null, 'Resource deleted successfully'))
})

/**
 * Get resources by department
 * GET /resources/department/:departmentId
 */
export const getResourcesByDepartment = asyncHandler(async (req, res) => {
  const { departmentId } = req.params
  const result = await ResourceService.getResourcesByDepartment(departmentId)
  res.status(200).json(new ApiResponse(200, result, 'Department resources retrieved successfully'))
})

/**
 * Get resources by type
 * GET /resources/type/:type
 */
export const getResourcesByType = asyncHandler(async (req, res) => {
  const { type } = req.params
  const result = await ResourceService.getResourcesByType(type)
  res.status(200).json(new ApiResponse(200, result, 'Resources by type retrieved successfully'))
})

/**
 * Check resource availability
 * GET /resources/:id/availability
 */
export const getResourceAvailability = asyncHandler(async (req, res) => {
  const { id } = req.params

  BookingValidator.validateAvailabilityCheckRequest(req.query)

  const { startTime, endTime } = req.query

  const isAvailable = await AvailabilityService.isAvailable(
    id,
    new Date(startTime),
    new Date(endTime)
  )

  const conflicts = isAvailable ? [] : await AvailabilityService.getConflictingBookings(
    id,
    new Date(startTime),
    new Date(endTime)
  )

  res.status(200).json(new ApiResponse(200, {
    resourceId: id,
    available: isAvailable,
    startTime,
    endTime,
    conflicts
  }, 'Availability check completed'))
})

/**
 * Get resource calendar
 * GET /resources/:id/calendar
 */
export const getResourceCalendar = asyncHandler(async (req, res) => {
  const { id } = req.params

  BookingValidator.validateCalendarRequest(req.query)

  const { startDate, endDate } = req.query

  const calendar = await AvailabilityService.getResourceCalendar(
    id,
    new Date(startDate),
    new Date(endDate)
  )

  res.status(200).json(new ApiResponse(200, calendar, 'Calendar retrieved successfully'))
})

/**
 * Get available slots for resource
 * GET /resources/:id/slots
 */
export const getAvailableSlots = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { date, slotDuration = 30, startHour = '09:00', endHour = '17:00' } = req.query

  if (!date) {
    return res.status(400).json(new ApiResponse(400, null, 'date query parameter is required'))
  }

  const slots = await AvailabilityService.getAvailableSlots(
    id,
    new Date(date),
    parseInt(slotDuration),
    startHour,
    endHour
  )

  res.status(200).json(new ApiResponse(200, slots, 'Available slots retrieved successfully'))
})

/**
 * Toggle resource active status (admin only)
 * PUT /resources/:id/toggle-status
 */
export const toggleResourceStatus = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userRole = req.user?.role || 'EMPLOYEE'

  // RBAC: Admin only
  if (!hasPermission(userRole, 'resource:update')) {
    return res.status(403).json(new ApiResponse(403, null, 'Insufficient permissions'))
  }

  const { isActive } = req.body

  if (typeof isActive !== 'boolean') {
    return res.status(400).json(new ApiResponse(400, null, 'isActive must be a boolean'))
  }

  const result = await ResourceService.toggleResourceStatus(id, isActive)
  res.status(200).json(new ApiResponse(200, result, 'Resource status toggled successfully'))
})

/**
 * Get resource statistics
 * GET /resources/:id/stats
 */
export const getResourceStatistics = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userRole = req.user?.role || 'EMPLOYEE'

  // RBAC: Admin/Manager only
  if (!hasPermission(userRole, 'resource:read')) {
    return res.status(403).json(new ApiResponse(403, null, 'Insufficient permissions'))
  }

  const { startDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), endDate = new Date() } = req.query

  const stats = await ResourceService.getResourceStatistics(id, new Date(startDate), new Date(endDate))

  res.status(200).json(new ApiResponse(200, stats, 'Resource statistics retrieved successfully'))
})

/**
 * Search resources
 * GET /resources/search
 */
export const searchResources = asyncHandler(async (req, res) => {
  const { q } = req.query

  if (!q) {
    return res.status(400).json(new ApiResponse(400, null, 'Search query parameter (q) is required'))
  }

  if (typeof q !== 'string' || q.trim().length === 0) {
    return res.status(400).json(new ApiResponse(400, null, 'Search query must be a non-empty string'))
  }

  if (q.length > 100) {
    return res.status(400).json(new ApiResponse(400, null, 'Search query cannot exceed 100 characters'))
  }

  const results = await ResourceService.searchResources(q)
  res.status(200).json(new ApiResponse(200, results, 'Search completed successfully'))
})
