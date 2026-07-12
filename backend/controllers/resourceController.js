import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import ResourceService from '../services/ResourceService.js'

export const getAllResources = asyncHandler(async (req, res) => {
  const result = await ResourceService.getAll()
  res.status(200).json(new ApiResponse(200, result))
})

export const createResource = asyncHandler(async (req, res) => {
  const result = await ResourceService.create(req.body)
  res.status(201).json(new ApiResponse(201, result, 'Resource created successfully'))
})

export const getResourceById = asyncHandler(async (req, res) => {
  const result = await ResourceService.getById(req.params.id)
  res.status(200).json(new ApiResponse(200, result))
})

export const updateResource = asyncHandler(async (req, res) => {
  const result = await ResourceService.update(req.params.id, req.body)
  res.status(200).json(new ApiResponse(200, result, 'Resource updated successfully'))
})

export const deleteResource = asyncHandler(async (req, res) => {
  await ResourceService.delete(req.params.id)
  res.status(200).json(new ApiResponse(200, null, 'Resource deleted successfully'))
})
