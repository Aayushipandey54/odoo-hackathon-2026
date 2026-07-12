/**
 * Booking Controller
 * Handles booking endpoints with RBAC and validation
 */

import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import BookingService from '../services/BookingService.js'
import BookingTimelineService from '../services/BookingTimelineService.js'
import BookingValidator from '../validators/BookingValidator.js'
import { hasPermission } from '../middleware/permissions.js'

/**
 * Create booking
 * POST /bookings
 */
export const createBooking = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'

  // Validate input
  BookingValidator.validateCreateBookingRequest(req.body)

  // Create booking
  const booking = await BookingService.createBooking(req.body, userId)

  res.status(201).json(new ApiResponse(201, booking, 'Booking created successfully'))
})

/**
 * Get all bookings (admin/manager only)
 * GET /bookings
 */
export const getAllBookings = asyncHandler(async (req, res) => {
  const userRole = req.user?.role || 'EMPLOYEE'

  // Only admin/managers can view all bookings
  if (!hasPermission(userRole, 'booking:read')) {
    return res.status(403).json(new ApiResponse(403, null, 'Insufficient permissions'))
  }

  const pagination = BookingValidator.validatePagination(req.query)
  const filters = BookingValidator.validateFilters(req.query)

  const bookings = await BookingService.getAllBookings(filters, pagination)

  res.status(200).json(new ApiResponse(200, bookings, 'Bookings retrieved successfully'))
})

/**
 * Get employee's own bookings
 * GET /bookings/my
 */
export const getMyBookings = asyncHandler(async (req, res) => {
  const employeeId = req.user?.employeeId
  if (!employeeId) {
    return res.status(400).json(new ApiResponse(400, null, 'Employee ID not found'))
  }

  const pagination = BookingValidator.validatePagination(req.query)
  const filters = BookingValidator.validateFilters(req.query)

  const bookings = await BookingService.getEmployeeBookings(employeeId, filters, pagination)

  res.status(200).json(new ApiResponse(200, bookings, 'Your bookings retrieved successfully'))
})

/**
 * Get upcoming bookings
 * GET /bookings/upcoming
 */
export const getUpcomingBookings = asyncHandler(async (req, res) => {
  const employeeId = req.user?.employeeId
  if (!employeeId) {
    return res.status(400).json(new ApiResponse(400, null, 'Employee ID not found'))
  }

  const hoursAhead = parseInt(req.query.hoursAhead) || 24

  const bookings = await BookingService.getUpcomingBookings(employeeId, hoursAhead)

  res.status(200).json(new ApiResponse(200, bookings, 'Upcoming bookings retrieved successfully'))
})

/**
 * Get booking by ID
 * GET /bookings/:id
 */
export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const employeeId = req.user?.employeeId
  const userRole = req.user?.role || 'EMPLOYEE'

  const booking = await BookingService.getBookingById(id)

  if (!booking) {
    return res.status(404).json(new ApiResponse(404, null, 'Booking not found'))
  }

  // RBAC: Can only view own booking or if admin/manager
  if (booking.employeeId !== employeeId && !hasPermission(userRole, 'booking:read')) {
    return res.status(403).json(new ApiResponse(403, null, 'Insufficient permissions to view this booking'))
  }

  res.status(200).json(new ApiResponse(200, booking, 'Booking retrieved successfully'))
})

/**
 * Approve booking (requires BOOKING_APPROVE permission)
 * PUT /bookings/:id/approve
 */
export const approveBooking = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user?.id || 'system'
  const userRole = req.user?.role || 'EMPLOYEE'

  // RBAC check
  if (!hasPermission(userRole, 'booking:approve')) {
    return res.status(403).json(new ApiResponse(403, null, 'Insufficient permissions to approve bookings'))
  }

  BookingValidator.validateApprovalRequest(req.body)

  const booking = await BookingService.approveBooking(id, userId, req.body.comments)

  res.status(200).json(new ApiResponse(200, booking, 'Booking approved successfully'))
})

/**
 * Reject booking (requires BOOKING_APPROVE permission)
 * PUT /bookings/:id/reject
 */
export const rejectBooking = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user?.id || 'system'
  const userRole = req.user?.role || 'EMPLOYEE'

  // RBAC check
  if (!hasPermission(userRole, 'booking:approve')) {
    return res.status(403).json(new ApiResponse(403, null, 'Insufficient permissions to reject bookings'))
  }

  BookingValidator.validateRejectionRequest(req.body)

  const booking = await BookingService.rejectBooking(id, userId, req.body.reason)

  res.status(200).json(new ApiResponse(200, booking, 'Booking rejected successfully'))
})

/**
 * Cancel booking
 * PUT /bookings/:id/cancel
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user?.id || 'system'
  const employeeId = req.user?.employeeId
  const userRole = req.user?.role || 'EMPLOYEE'

  if (!id) {
    return res.status(400).json(new ApiResponse(400, null, 'Booking ID is required'))
  }

  const booking = await BookingService.getBookingById(id)

  if (!booking) {
    return res.status(404).json(new ApiResponse(404, null, 'Booking not found'))
  }

  // RBAC: Can cancel own booking or if admin/manager
  const canCancelAny = hasPermission(userRole, 'booking:cancel:any')
  if (booking.employeeId !== employeeId && !canCancelAny) {
    return res.status(403).json(new ApiResponse(403, null, 'You can only cancel your own bookings'))
  }

  BookingValidator.validateCancellationRequest(req.body)

  const updated = await BookingService.cancelBooking(id, userId, req.body.reason)

  res.status(200).json(new ApiResponse(200, updated, 'Booking cancelled successfully'))
})

/**
 * Modify booking
 * PUT /bookings/:id/modify
 */
export const modifyBooking = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user?.id || 'system'
  const employeeId = req.user?.employeeId
  const userRole = req.user?.role || 'EMPLOYEE'

  if (!id) {
    return res.status(400).json(new ApiResponse(400, null, 'Booking ID is required'))
  }

  const booking = await BookingService.getBookingById(id)

  if (!booking) {
    return res.status(404).json(new ApiResponse(404, null, 'Booking not found'))
  }

  // RBAC: Can modify own booking or if admin
  const canModifyAny = hasPermission(userRole, 'booking:cancel:any')
  if (booking.employeeId !== employeeId && !canModifyAny) {
    return res.status(403).json(new ApiResponse(403, null, 'You can only modify your own bookings'))
  }

  BookingValidator.validateModifyBookingRequest(req.body)

  const updated = await BookingService.modifyBooking(
    id,
    req.body.startTime,
    req.body.endTime,
    userId
  )

  res.status(200).json(new ApiResponse(200, updated, 'Booking modified successfully'))
})

/**
 * Get booking timeline
 * GET /bookings/:id/timeline
 */
export const getBookingTimeline = asyncHandler(async (req, res) => {
  const { id } = req.params
  const employeeId = req.user?.employeeId
  const userRole = req.user?.role || 'EMPLOYEE'

  const booking = await BookingService.getBookingById(id)

  if (!booking) {
    return res.status(404).json(new ApiResponse(404, null, 'Booking not found'))
  }

  // RBAC: Can view own booking timeline or if admin/manager
  if (booking.employeeId !== employeeId && !hasPermission(userRole, 'booking:read')) {
    return res.status(403).json(new ApiResponse(403, null, 'Insufficient permissions'))
  }

  const timeline = await BookingTimelineService.getBookingTimeline(id)

  res.status(200).json(new ApiResponse(200, timeline, 'Booking timeline retrieved successfully'))
})

/**
 * Get pending approvals (requires BOOKING_APPROVE permission)
 * GET /bookings/pending/approvals
 */
export const getPendingApprovals = asyncHandler(async (req, res) => {
  const userRole = req.user?.role || 'EMPLOYEE'

  // RBAC check
  if (!hasPermission(userRole, 'booking:approve')) {
    return res.status(403).json(new ApiResponse(403, null, 'Insufficient permissions to view approvals'))
  }

  const bookings = await BookingService.getPendingApprovals()

  res.status(200).json(new ApiResponse(200, bookings, 'Pending approvals retrieved successfully'))
})

/**
 * Get booking statistics
 * GET /bookings/stats
 */
export const getBookingStatistics = asyncHandler(async (req, res) => {
  const userRole = req.user?.role || 'EMPLOYEE'

  // Only admin/managers
  if (!hasPermission(userRole, 'booking:read')) {
    return res.status(403).json(new ApiResponse(403, null, 'Insufficient permissions'))
  }

  const stats = await BookingService.getBookingStatistics()

  res.status(200).json(new ApiResponse(200, stats, 'Booking statistics retrieved successfully'))
})
