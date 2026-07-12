/**
 * Workflow Validator
 * Input validation for workflow requests
 * Validates request structure and business rules
 */

import { ValidationError } from '../utils/errors.js'

export class WorkflowValidator {
  /**
   * Validate allocation request
   * @param {Object} data - Request data
   * @throws {ValidationError} if invalid
   */
  validateAllocationRequest(data) {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Request body must be an object')
    }

    const { assetId, employeeId } = data

    // Validate required fields
    if (!assetId) {
      throw new ValidationError('assetId is required')
    }

    if (!employeeId) {
      throw new ValidationError('employeeId is required')
    }

    // Validate format
    if (typeof assetId !== 'string' || assetId.trim() === '') {
      throw new ValidationError('assetId must be a non-empty string')
    }

    if (typeof employeeId !== 'string' || employeeId.trim() === '') {
      throw new ValidationError('employeeId must be a non-empty string')
    }

    // Validate UUIDs (basic check)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidPattern.test(assetId)) {
      throw new ValidationError('assetId must be a valid UUID')
    }

    if (!uuidPattern.test(employeeId)) {
      throw new ValidationError('employeeId must be a valid UUID')
    }
  }

  /**
   * Validate return request
   * @param {Object} data - Request data
   * @throws {ValidationError} if invalid
   */
  validateReturnRequest(data) {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Request body must be an object')
    }

    const { condition } = data

    // Condition is optional but if provided, must be valid
    if (condition) {
      const validConditions = ['NEW', 'GOOD', 'FAIR', 'DAMAGED']
      if (!validConditions.includes(condition.toUpperCase())) {
        throw new ValidationError(
          `condition must be one of: ${validConditions.join(', ')}`
        )
      }
    }
  }

  /**
   * Validate transfer request
   * @param {Object} data - Request data
   * @throws {ValidationError} if invalid
   */
  validateTransferRequest(data) {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Request body must be an object')
    }

    const { assetId, fromEmployeeId, toEmployeeId, reason } = data

    // Validate required fields
    if (!assetId) {
      throw new ValidationError('assetId is required')
    }

    if (!fromEmployeeId) {
      throw new ValidationError('fromEmployeeId is required')
    }

    if (!toEmployeeId) {
      throw new ValidationError('toEmployeeId is required')
    }

    // Validate format
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (!uuidPattern.test(assetId)) {
      throw new ValidationError('assetId must be a valid UUID')
    }

    if (!uuidPattern.test(fromEmployeeId)) {
      throw new ValidationError('fromEmployeeId must be a valid UUID')
    }

    if (!uuidPattern.test(toEmployeeId)) {
      throw new ValidationError('toEmployeeId must be a valid UUID')
    }

    // Validate different employees
    if (fromEmployeeId === toEmployeeId) {
      throw new ValidationError('fromEmployeeId and toEmployeeId must be different')
    }

    // Validate reason if provided
    if (reason && typeof reason !== 'string') {
      throw new ValidationError('reason must be a string')
    }

    if (reason && reason.trim().length === 0) {
      throw new ValidationError('reason cannot be empty')
    }

    if (reason && reason.length > 500) {
      throw new ValidationError('reason cannot exceed 500 characters')
    }
  }

  /**
   * Validate transfer approval request
   * @param {Object} data - Request data
   * @throws {ValidationError} if invalid
   */
  validateTransferApprovalRequest(data) {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Request body must be an object')
    }

    // Comments are optional
    const { comments } = data

    if (comments && typeof comments !== 'string') {
      throw new ValidationError('comments must be a string')
    }

    if (comments && comments.length > 500) {
      throw new ValidationError('comments cannot exceed 500 characters')
    }
  }

  /**
   * Validate transfer rejection request
   * @param {Object} data - Request data
   * @throws {ValidationError} if invalid
   */
  validateTransferRejectionRequest(data) {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Request body must be an object')
    }

    const { reason } = data

    if (!reason) {
      throw new ValidationError('reason is required for rejection')
    }

    if (typeof reason !== 'string' || reason.trim() === '') {
      throw new ValidationError('reason must be a non-empty string')
    }

    if (reason.length > 500) {
      throw new ValidationError('reason cannot exceed 500 characters')
    }
  }

  /**
   * Validate pagination parameters
   * @param {Object} params - Query parameters
   * @returns {Object} validated pagination params
   */
  validatePagination(params = {}) {
    const { skip = 0, take = 20 } = params

    // Validate skip
    const validatedSkip = Math.max(0, parseInt(skip, 10) || 0)

    // Validate take (limit between 1 and 100)
    let validatedTake = Math.min(100, Math.max(1, parseInt(take, 10) || 20))

    return { skip: validatedSkip, take: validatedTake }
  }

  /**
   * Validate filter parameters
   * @param {Object} filters - Filter object
   * @returns {Object} validated filters
   */
  validateFilters(filters = {}) {
    const validated = {}

    if (filters.status) {
      const validStatuses = ['AVAILABLE', 'ALLOCATED', 'PENDING', 'APPROVED', 'REJECTED']
      if (!validStatuses.includes(filters.status.toUpperCase())) {
        throw new ValidationError(`Invalid status filter: ${filters.status}`)
      }
      validated.status = filters.status.toUpperCase()
    }

    if (filters.employeeId) {
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidPattern.test(filters.employeeId)) {
        throw new ValidationError('employeeId filter must be a valid UUID')
      }
      validated.employeeId = filters.employeeId
    }

    if (filters.departmentId) {
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidPattern.test(filters.departmentId)) {
        throw new ValidationError('departmentId filter must be a valid UUID')
      }
      validated.departmentId = filters.departmentId
    }

    return validated
  }
}

export default new WorkflowValidator()
