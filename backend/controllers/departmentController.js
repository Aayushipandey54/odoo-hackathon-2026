import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import DepartmentService from '../services/DepartmentService.js'

export const getAllDepartments = asyncHandler(async (req, res) => {
  const result = await DepartmentService.getAll(req.query)
  res.status(200).json(new ApiResponse(200, result))
})

export const createDepartment = asyncHandler(async (req, res) => {
  const result = await DepartmentService.create(req.body)
  res.status(201).json(new ApiResponse(201, result, 'Department created successfully'))
})

export const getDepartmentById = asyncHandler(async (req, res) => {
  const result = await DepartmentService.getById(req.params.id)
  res.status(200).json(new ApiResponse(200, result))
})

export const updateDepartment = asyncHandler(async (req, res) => {
  const result = await DepartmentService.update(req.params.id, req.body)
  res.status(200).json(new ApiResponse(200, result, 'Department updated successfully'))
})

export const deleteDepartment = asyncHandler(async (req, res) => {
  await DepartmentService.delete(req.params.id)
  res.status(200).json(new ApiResponse(200, null, 'Department deleted successfully'))
})
