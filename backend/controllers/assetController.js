import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import AssetService from '../services/AssetService.js'

export const getAllAssets = asyncHandler(async (req, res) => {
  const result = await AssetService.getAll()
  res.status(200).json(new ApiResponse(200, result))
})

export const createAsset = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const result = await AssetService.create(req.body, userId)
  res.status(201).json(new ApiResponse(201, result, 'Asset registered successfully'))
})

export const getAssetById = asyncHandler(async (req, res) => {
  const result = await AssetService.getById(req.params.id)
  res.status(200).json(new ApiResponse(200, result))
})

export const updateAsset = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const result = await AssetService.update(req.params.id, req.body, userId)
  res.status(200).json(new ApiResponse(200, result, 'Asset updated successfully'))
})

export const searchAssets = asyncHandler(async (req, res) => {
  const result = await AssetService.search(req.query.q || '')
  res.status(200).json(new ApiResponse(200, result))
})
