import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import NotificationService from '../services/NotificationService.js'

export const getAllNotifications = asyncHandler(async (req, res) => {
  const result = await NotificationService.getAll()
  res.status(200).json(new ApiResponse(200, result))
})
