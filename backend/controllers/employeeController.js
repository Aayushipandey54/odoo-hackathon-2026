import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import EmployeeService from '../services/EmployeeService.js'

export const getAllEmployees = asyncHandler(async (req, res) => {
  const result = await EmployeeService.getAll()
  res.status(200).json(new ApiResponse(200, result))
})

export const createEmployee = asyncHandler(async (req, res) => {
  const result = await EmployeeService.create(req.body)
  res.status(201).json(new ApiResponse(201, result, 'Employee created successfully'))
})

export const getEmployeeById = asyncHandler(async (req, res) => {
  const result = await EmployeeService.getById(req.params.id)
  res.status(200).json(new ApiResponse(200, result))
})

export const updateEmployee = asyncHandler(async (req, res) => {
  const result = await EmployeeService.update(req.params.id, req.body)
  res.status(200).json(new ApiResponse(200, result, 'Employee updated successfully'))
})

export const deleteEmployee = asyncHandler(async (req, res) => {
  await EmployeeService.delete(req.params.id)
  res.status(200).json(new ApiResponse(200, null, 'Employee deleted successfully'))
})
