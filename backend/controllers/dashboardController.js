import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import DashboardService from '../services/DashboardService.js'

export const getDashboardStats = asyncHandler(async (req, res) => {
  const result = await DashboardService.getStats()
  res.status(200).json(new ApiResponse(200, result))
})
