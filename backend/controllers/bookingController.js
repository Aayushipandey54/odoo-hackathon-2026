import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import BookingService from '../services/BookingService.js'

export const getAllBookings = asyncHandler(async (req, res) => {
  const result = await BookingService.getAll()
  res.status(200).json(new ApiResponse(200, result))
})

export const bookResource = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const { resourceId, employeeId, startTime, endTime } = req.body
  const result = await BookingService.book(resourceId, employeeId, startTime, endTime, userId)
  res.status(201).json(new ApiResponse(201, result, 'Resource booked successfully'))
})
