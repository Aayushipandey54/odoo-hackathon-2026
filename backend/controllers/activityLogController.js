import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import ActivityLogService from '../services/ActivityLogService.js'

export const getAllLogs = asyncHandler(async (req, res) => {
  const result = await ActivityLogService.getAll()
  res.status(200).json(new ApiResponse(200, result))
})
