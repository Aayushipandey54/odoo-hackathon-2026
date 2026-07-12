import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import LocationService from '../services/LocationService.js'

export const getAllLocations = asyncHandler(async (req, res) => {
  const result = await LocationService.getAll(req.query)
  res.status(200).json(new ApiResponse(200, result))
})

export const createLocation = asyncHandler(async (req, res) => {
  const result = await LocationService.create(req.body)
  res.status(201).json(new ApiResponse(201, result, 'Location created successfully'))
})

export const getLocationById = asyncHandler(async (req, res) => {
  const result = await LocationService.getById(req.params.id)
  res.status(200).json(new ApiResponse(200, result))
})

export const updateLocation = asyncHandler(async (req, res) => {
  const result = await LocationService.update(req.params.id, req.body)
  res.status(200).json(new ApiResponse(200, result, 'Location updated successfully'))
})

export const deleteLocation = asyncHandler(async (req, res) => {
  await LocationService.delete(req.params.id)
  res.status(200).json(new ApiResponse(200, null, 'Location deleted successfully'))
})
