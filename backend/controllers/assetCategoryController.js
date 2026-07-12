import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import AssetCategoryService from '../services/AssetCategoryService.js'

export const getAllCategories = asyncHandler(async (req, res) => {
  const result = await AssetCategoryService.getAll(req.query)
  res.status(200).json(new ApiResponse(200, result))
})

export const createCategory = asyncHandler(async (req, res) => {
  const result = await AssetCategoryService.create(req.body)
  res.status(201).json(new ApiResponse(201, result, 'Category created successfully'))
})

export const getCategoryById = asyncHandler(async (req, res) => {
  const result = await AssetCategoryService.getById(req.params.id)
  res.status(200).json(new ApiResponse(200, result))
})

export const updateCategory = asyncHandler(async (req, res) => {
  const result = await AssetCategoryService.update(req.params.id, req.body)
  res.status(200).json(new ApiResponse(200, result, 'Category updated successfully'))
})

export const deleteCategory = asyncHandler(async (req, res) => {
  await AssetCategoryService.delete(req.params.id)
  res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully'))
})
