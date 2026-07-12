import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/apiResponse.js'
import TransferService from '../services/TransferService.js'

export const getAllTransfers = asyncHandler(async (req, res) => {
  const result = await TransferService.getAll()
  res.status(200).json(new ApiResponse(200, result))
})

export const requestTransfer = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const { assetId, fromEmployeeId, toEmployeeId, reason } = req.body
  const result = await TransferService.requestTransfer(assetId, fromEmployeeId, toEmployeeId, reason, userId)
  res.status(201).json(new ApiResponse(201, result, 'Transfer requested successfully'))
})

export const approveTransfer = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'system'
  const result = await TransferService.approveTransfer(req.params.id, userId)
  res.status(200).json(new ApiResponse(200, result, 'Transfer approved successfully'))
})
