/**
 * Workflow Service
 * API client for workflow operations
 * Handles allocation, transfer, return, and workflow history requests
 */

import apiClient from './api'

const API_BASE = '/api'

export const workflowService = {
  // ============ ALLOCATIONS ============

  /**
   * Get all allocations
   */
  getAllAllocations: async () => {
    try {
      const response = await apiClient.get(`${API_BASE}/allocations`)
      return response.data.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch allocations'
    }
  },

  /**
   * Allocate asset to employee
   * @param {string} assetId - Asset ID
   * @param {string} employeeId - Employee ID
   */
  allocateAsset: async (assetId, employeeId) => {
    try {
      const response = await apiClient.post(`${API_BASE}/allocations`, {
        assetId,
        employeeId
      })
      return response.data.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to allocate asset'
    }
  },

  /**
   * Return allocated asset
   * @param {string} allocationId - Allocation ID
   * @param {string} condition - Asset condition (NEW, GOOD, FAIR, DAMAGED)
   */
  returnAsset: async (allocationId, condition = 'GOOD') => {
    try {
      const response = await apiClient.post(
        `${API_BASE}/allocations/${allocationId}/return`,
        { condition }
      )
      return response.data.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to return asset'
    }
  },

  // ============ TRANSFERS ============

  /**
   * Get all transfer requests
   */
  getAllTransfers: async () => {
    try {
      const response = await apiClient.get(`${API_BASE}/transfers`)
      return response.data.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch transfers'
    }
  },

  /**
   * Get transfers by status
   * @param {string} status - Status filter (PENDING, APPROVED, REJECTED)
   */
  getTransfersByStatus: async (status) => {
    try {
      const response = await apiClient.get(`${API_BASE}/transfers`, {
        params: { status }
      })
      return response.data.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch transfers'
    }
  },

  /**
   * Get pending transfers for current user (approver)
   */
  getPendingTransfers: async () => {
    try {
      const response = await apiClient.get(`${API_BASE}/transfers/pending`)
      return response.data.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch pending transfers'
    }
  },

  /**
   * Request asset transfer
   * @param {string} assetId - Asset ID
   * @param {string} fromEmployeeId - Current owner
   * @param {string} toEmployeeId - New owner
   * @param {string} reason - Transfer reason
   */
  requestTransfer: async (assetId, fromEmployeeId, toEmployeeId, reason = '') => {
    try {
      const response = await apiClient.post(`${API_BASE}/transfers`, {
        assetId,
        fromEmployeeId,
        toEmployeeId,
        reason
      })
      return response.data.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to request transfer'
    }
  },

  /**
   * Approve transfer request
   * @param {string} transferId - Transfer ID
   * @param {string} comments - Approval comments
   */
  approveTransfer: async (transferId, comments = '') => {
    try {
      const response = await apiClient.patch(
        `${API_BASE}/transfers/${transferId}/approve`,
        { comments }
      )
      return response.data.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to approve transfer'
    }
  },

  /**
   * Reject transfer request
   * @param {string} transferId - Transfer ID
   * @param {string} reason - Rejection reason
   */
  rejectTransfer: async (transferId, reason) => {
    try {
      const response = await apiClient.patch(
        `${API_BASE}/transfers/${transferId}/reject`,
        { reason }
      )
      return response.data.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to reject transfer'
    }
  },

  // ============ WORKFLOW HISTORY ============

  /**
   * Get workflow history for an asset
   * @param {string} assetId - Asset ID
   * @param {number} limit - Number of records
   * @param {number} offset - Pagination offset
   */
  getWorkflowHistory: async (assetId, limit = 50, offset = 0) => {
    try {
      const response = await apiClient.get(
        `${API_BASE}/workflow/history/${assetId}`,
        {
          params: { limit, offset }
        }
      )
      return response.data.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch workflow history'
    }
  },

  /**
   * Get pending workflows (approvals) for current user
   */
  getPendingWorkflows: async () => {
    try {
      const response = await apiClient.get(`${API_BASE}/workflow/pending`)
      return response.data.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch pending workflows'
    }
  },

  /**
   * Get workflow statistics
   */
  getWorkflowStats: async () => {
    try {
      const response = await apiClient.get(`${API_BASE}/workflow/stats`)
      return response.data.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch workflow stats'
    }
  },

  /**
   * Get specific workflow detail
   * @param {string} workflowId - Workflow ID
   */
  getWorkflowDetail: async (workflowId) => {
    try {
      const response = await apiClient.get(`${API_BASE}/workflow/${workflowId}`)
      return response.data.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch workflow detail'
    }
  },

  // ============ NOTIFICATIONS ============

  /**
   * Get user notifications
   * @param {number} limit - Limit
   * @param {number} offset - Offset
   */
  getNotifications: async (limit = 20, offset = 0) => {
    try {
      const response = await apiClient.get(`${API_BASE}/notifications`, {
        params: { limit, offset }
      })
      return response.data.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch notifications'
    }
  },

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   */
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await apiClient.patch(
        `${API_BASE}/notifications/${notificationId}/read`
      )
      return response.data.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to mark notification as read'
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllNotificationsAsRead: async () => {
    try {
      const response = await apiClient.patch(`${API_BASE}/notifications/read-all`)
      return response.data.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to mark notifications as read'
    }
  }
}

export default workflowService
