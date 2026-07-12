import api from './api'

/**
 * Asset Service
 * API integration for all asset-related operations
 */

export const assetService = {
  // ===== ASSET CRUD =====

  /**
   * Get all assets with pagination and filters
   */
  async getAll(params = {}) {
    try {
      const response = await api.get('/assets', { params })
      return response.data
    } catch (error) {
      throw this._handleError(error)
    }
  },

  /**
   * Get asset by ID with full details
   */
  async getById(id) {
    try {
      const response = await api.get(`/assets/${id}`)
      return response.data
    } catch (error) {
      throw this._handleError(error)
    }
  },

  /**
   * Create new asset
   */
  async create(assetData) {
    try {
      const response = await api.post('/assets', assetData)
      return response.data
    } catch (error) {
      throw this._handleError(error)
    }
  },

  /**
   * Update asset
   */
  async update(id, assetData) {
    try {
      const response = await api.put(`/assets/${id}`, assetData)
      return response.data
    } catch (error) {
      throw this._handleError(error)
    }
  },

  /**
   * Delete asset
   */
  async delete(id) {
    try {
      const response = await api.delete(`/assets/${id}`)
      return response.data
    } catch (error) {
      throw this._handleError(error)
    }
  },

  // ===== SEARCH & FILTERING =====

  /**
   * Search assets with advanced filters
   */
  async search(filters = {}) {
    try {
      const response = await api.get('/assets/search', { params: filters })
      return response.data
    } catch (error) {
      throw this._handleError(error)
    }
  },

  /**
   * Get asset statistics
   */
  async getStatistics() {
    try {
      const response = await api.get('/assets/stats')
      return response.data
    } catch (error) {
      throw this._handleError(error)
    }
  },

  // ===== IMAGES =====

  /**
   * Upload asset image
   */
  async uploadImage(assetId, file, isPrimary = false) {
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('isPrimary', isPrimary)

      const response = await api.post(`/assets/${assetId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw this._handleError(error)
    }
  },

  /**
   * Delete asset image
   */
  async deleteImage(assetId, imageId) {
    try {
      const response = await api.delete(`/assets/${assetId}/images/${imageId}`)
      return response.data
    } catch (error) {
      throw this._handleError(error)
    }
  },

  // ===== DOCUMENTS =====

  /**
   * Upload asset document
   */
  async uploadDocument(assetId, file, documentType = 'OTHER') {
    try {
      const formData = new FormData()
      formData.append('document', file)
      formData.append('documentType', documentType)

      const response = await api.post(`/assets/${assetId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw this._handleError(error)
    }
  },

  /**
   * Delete asset document
   */
  async deleteDocument(assetId, docId) {
    try {
      const response = await api.delete(`/assets/${assetId}/documents/${docId}`)
      return response.data
    } catch (error) {
      throw this._handleError(error)
    }
  },

  // ===== QR CODE =====

  /**
   * Get asset QR code
   */
  async getQRCode(assetId) {
    try {
      const response = await api.get(`/assets/${assetId}/qrcode`)
      return response.data
    } catch (error) {
      throw this._handleError(error)
    }
  },

  /**
   * Regenerate asset QR code
   */
  async regenerateQRCode(assetId) {
    try {
      const response = await api.post(`/assets/${assetId}/qrcode/regenerate`)
      return response.data
    } catch (error) {
      throw this._handleError(error)
    }
  },

  // ===== TIMELINE =====

  /**
   * Get asset timeline
   */
  async getTimeline(assetId, options = {}) {
    try {
      const response = await api.get(`/assets/${assetId}/timeline`, { params: options })
      return response.data
    } catch (error) {
      throw this._handleError(error)
    }
  },

  // ===== HELPER METHODS =====

  /**
   * Handle API errors
   */
  _handleError(error) {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred'
      const errors = error.response.data?.errors || []
      return {
        message,
        errors,
        status: error.response.status
      }
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'No response from server',
        errors: [],
        status: null
      }
    } else {
      // Error in request setup
      return {
        message: error.message,
        errors: [],
        status: null
      }
    }
  }
}

export default assetService
