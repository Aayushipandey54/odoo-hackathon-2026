import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import AllocationService from '../services/AllocationService.js'

export const getAllAllocations = asyncHandler(async (req, res) => {
  const result = await AllocationService.getAll()
  res.status(200).json(new ApiResponse(200, result))
})

export const allocateAsset = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const { assetId, employeeId } = req.body
  const result = await AllocationService.allocate(assetId, employeeId, userId)
  res.status(201).json(new ApiResponse(201, result, 'Asset allocated successfully'))
})

export const returnAsset = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const { condition } = req.body
  const result = await AllocationService.returnAsset(req.params.id, condition, userId)
  res.status(200).json(new ApiResponse(200, result, 'Asset returned successfully'))
})
