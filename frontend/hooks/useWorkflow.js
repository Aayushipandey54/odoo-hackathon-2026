/**
 * useWorkflow Hook
 * React hook for workflow state management
 * Handles loading, error states, and data caching
 */

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import workflowService from '../services/workflowService'

/**
 * Hook to fetch all allocations
 */
export const useAllocations = () => {
  const {
    data: allocations,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['allocations'],
    queryFn: () => workflowService.getAllAllocations(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  })

  return {
    allocations: allocations || [],
    isLoading,
    error: error?.message,
    refetch
  }
}

/**
 * Hook to allocate an asset
 */
export const useAllocateAsset = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState(null)

  const { mutate, isLoading, isSuccess } = useMutation({
    mutationFn: ({ assetId, employeeId }) =>
      workflowService.allocateAsset(assetId, employeeId),
    onSuccess: (data) => {
      // Invalidate and refetch allocations
      queryClient.invalidateQueries({ queryKey: ['allocations'] })
      setError(null)
    },
    onError: (err) => {
      setError(err.message || 'Failed to allocate asset')
    }
  })

  return {
    allocate: mutate,
    isLoading,
    isSuccess,
    error
  }
}

/**
 * Hook to return an asset
 */
export const useReturnAsset = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState(null)

  const { mutate, isLoading, isSuccess } = useMutation({
    mutationFn: ({ allocationId, condition }) =>
      workflowService.returnAsset(allocationId, condition),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] })
      setError(null)
    },
    onError: (err) => {
      setError(err.message || 'Failed to return asset')
    }
  })

  return {
    returnAsset: mutate,
    isLoading,
    isSuccess,
    error
  }
}

/**
 * Hook to fetch all transfers
 */
export const useTransfers = (status = null) => {
  const {
    data: transfers,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['transfers', status],
    queryFn: () => {
      if (status) {
        return workflowService.getTransfersByStatus(status)
      }
      return workflowService.getAllTransfers()
    },
    staleTime: 5 * 60 * 1000
  })

  return {
    transfers: transfers || [],
    isLoading,
    error: error?.message,
    refetch
  }
}

/**
 * Hook to fetch pending transfers for current user
 */
export const usePendingTransfers = () => {
  const {
    data: transfers,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['pendingTransfers'],
    queryFn: () => workflowService.getPendingTransfers(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000 // Auto-refresh every 5 minutes
  })

  return {
    transfers: transfers || [],
    isLoading,
    error: error?.message,
    refetch
  }
}

/**
 * Hook to request a transfer
 */
export const useRequestTransfer = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState(null)

  const { mutate, isLoading, isSuccess } = useMutation({
    mutationFn: ({ assetId, fromEmployeeId, toEmployeeId, reason }) =>
      workflowService.requestTransfer(assetId, fromEmployeeId, toEmployeeId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] })
      queryClient.invalidateQueries({ queryKey: ['pendingTransfers'] })
      setError(null)
    },
    onError: (err) => {
      setError(err.message || 'Failed to request transfer')
    }
  })

  return {
    requestTransfer: mutate,
    isLoading,
    isSuccess,
    error
  }
}

/**
 * Hook to approve a transfer
 */
export const useApproveTransfer = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState(null)

  const { mutate, isLoading, isSuccess } = useMutation({
    mutationFn: ({ transferId, comments }) =>
      workflowService.approveTransfer(transferId, comments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] })
      queryClient.invalidateQueries({ queryKey: ['pendingTransfers'] })
      setError(null)
    },
    onError: (err) => {
      setError(err.message || 'Failed to approve transfer')
    }
  })

  return {
    approveTransfer: mutate,
    isLoading,
    isSuccess,
    error
  }
}

/**
 * Hook to reject a transfer
 */
export const useRejectTransfer = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState(null)

  const { mutate, isLoading, isSuccess } = useMutation({
    mutationFn: ({ transferId, reason }) =>
      workflowService.rejectTransfer(transferId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] })
      queryClient.invalidateQueries({ queryKey: ['pendingTransfers'] })
      setError(null)
    },
    onError: (err) => {
      setError(err.message || 'Failed to reject transfer')
    }
  })

  return {
    rejectTransfer: mutate,
    isLoading,
    isSuccess,
    error
  }
}

/**
 * Hook to fetch workflow history for an asset
 */
export const useWorkflowHistory = (assetId) => {
  const {
    data: history,
    isLoading,
    error
  } = useQuery({
    queryKey: ['workflowHistory', assetId],
    queryFn: () => workflowService.getWorkflowHistory(assetId),
    enabled: !!assetId,
    staleTime: 5 * 60 * 1000
  })

  return {
    history: history?.data || [],
    total: history?.total || 0,
    isLoading,
    error: error?.message
  }
}

/**
 * Hook to fetch pending workflows
 */
export const usePendingWorkflows = () => {
  const {
    data: workflows,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['pendingWorkflows'],
    queryFn: () => workflowService.getPendingWorkflows(),
    staleTime: 2 * 60 * 1000
  })

  return {
    workflows: workflows || {},
    isLoading,
    error: error?.message,
    refetch
  }
}

/**
 * Hook to fetch workflow statistics
 */
export const useWorkflowStats = () => {
  const {
    data: stats,
    isLoading,
    error
  } = useQuery({
    queryKey: ['workflowStats'],
    queryFn: () => workflowService.getWorkflowStats(),
    staleTime: 10 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000
  })

  return {
    stats: stats || {},
    isLoading,
    error: error?.message
  }
}

export default {
  useAllocations,
  useAllocateAsset,
  useReturnAsset,
  useTransfers,
  usePendingTransfers,
  useRequestTransfer,
  useApproveTransfer,
  useRejectTransfer,
  useWorkflowHistory,
  usePendingWorkflows,
  useWorkflowStats
}
