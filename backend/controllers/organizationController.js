import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import OrganizationSettingsService from '../services/OrganizationSettingsService.js'

export const getOrganizationSettings = asyncHandler(async (req, res) => {
  const result = await OrganizationSettingsService.getSettings()
  res.status(200).json(new ApiResponse(200, result))
})

export const updateOrganizationSettings = asyncHandler(async (req, res) => {
  const result = await OrganizationSettingsService.updateSettings(req.body)
  res.status(200).json(new ApiResponse(200, result, 'Organization settings updated successfully'))
})
