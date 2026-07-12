import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import AuthService from '../services/AuthService.js'

export const register = asyncHandler(async (req, res) => {
  const result = await AuthService.register(req.body)
  res.status(201).json(new ApiResponse(201, result, 'User registered successfully'))
})

export const login = asyncHandler(async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress
  const userAgent = req.headers['user-agent'] || 'Unknown'
  
  const result = await AuthService.login({
    email: req.body.email,
    password: req.body.password,
    ip,
    userAgent
  })
  
  res.status(200).json(new ApiResponse(200, result, 'Login successful'))
})

export const refresh = asyncHandler(async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress
  const result = await AuthService.refresh({
    refreshToken: req.body.refreshToken,
    ip
  })

  res.status(200).json(new ApiResponse(200, result, 'Token refreshed successfully'))
})

export const logout = asyncHandler(async (req, res) => {
  // Extract userId from authenticated request
  await AuthService.logout(req.user?.id)
  res.status(200).json(new ApiResponse(200, null, 'Logout successful'))
})
