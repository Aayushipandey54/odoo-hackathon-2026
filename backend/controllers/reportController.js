import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import ReportService from '../services/ReportService.js'

export const getReports = asyncHandler(async (req, res) => {
  const result = await ReportService.getReports()
  res.status(200).json(new ApiResponse(200, result))
})
