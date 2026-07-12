/**
 * Booking Validator
 * Input validation for booking requests
 * Validates request structure and booking business rules
 */

import { ValidationError } from '../utils/errors.js'

export class BookingValidator {
  /**
   * Validate booking creation request
   * @param {Object} data - Request data
   * @throws {ValidationError} if invalid
   */
  validateCreateBookingRequest(data) {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Request body must be an object')
    }

    const { resourceId, employeeId, startTime, endTime, purpose } = data

    // Validate required fields
    if (!resourceId) {
      throw new ValidationError('resourceId is required')
    }

    if (!employeeId) {
      throw new ValidationError('employeeId is required')
    }

    if (!startTime) {
      throw new ValidationError('startTime is required')
    }

    if (!endTime) {
      throw new ValidationError('endTime is required')
    }

    // Validate format
    this.validateUUID(resourceId, 'resourceId')
    this.validateUUID(employeeId, 'employeeId')
    this.validateDateTime(startTime, 'startTime')
    this.validateDateTime(endTime, 'endTime')

    // Validate time range
    this.validateTimeRange(startTime, endTime)

    // Validate optional purpose
    if (purpose) {
      if (typeof purpose !== 'string') {
        throw new ValidationError('purpose must be a string')
      }

      if (purpose.trim().length === 0) {
        throw new ValidationError('purpose cannot be empty')
      }

      if (purpose.length > 500) {
        throw new ValidationError('purpose cannot exceed 500 characters')
      }
    }
  }

  /**
   * Validate booking modification request
   * @param {Object} data - Request data
   * @throws {ValidationError} if invalid
   */
  validateModifyBookingRequest(data) {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Request body must be an object')
    }

    const { startTime, endTime, purpose } = data

    // At least one field must be provided
    if (!startTime && !endTime && !purpose) {
      throw new ValidationError('At least one field (startTime, endTime, purpose) must be provided')
    }

    if (startTime) {
      this.validateDateTime(startTime, 'startTime')
    }

    if (endTime) {
      this.validateDateTime(endTime, 'endTime')
    }

    // If both times provided, validate range
    if (startTime && endTime) {
      this.validateTimeRange(startTime, endTime)
    }

    if (purpose) {
      if (typeof purpose !== 'string') {
        throw new ValidationError('purpose must be a string')
      }

      if (purpose.trim().length === 0) {
        throw new ValidationError('purpose cannot be empty')
      }

      if (purpose.length > 500) {
        throw new ValidationError('purpose cannot exceed 500 characters')
      }
    }
  }

  /**
   * Validate booking approval request
   * @param {Object} data - Request data
   * @throws {ValidationError} if invalid
   */
  validateApprovalRequest(data) {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Request body must be an object')
    }

    // Comments are optional
    const { comments } = data

    if (comments) {
      if (typeof comments !== 'string') {
        throw new ValidationError('comments must be a string')
      }

      if (comments.length > 500) {
        throw new ValidationError('comments cannot exceed 500 characters')
      }
    }
  }

  /**
   * Validate booking rejection request
   * @param {Object} data - Request data
   * @throws {ValidationError} if invalid
   */
  validateRejectionRequest(data) {
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
   * Validate booking cancellation request
   * @param {Object} data - Request data
   * @throws {ValidationError} if invalid
   */
  validateCancellationRequest(data) {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Request body must be an object')
    }

    const { reason } = data

    if (!reason) {
      throw new ValidationError('reason is required for cancellation')
    }

    if (typeof reason !== 'string' || reason.trim() === '') {
      throw new ValidationError('reason must be a non-empty string')
    }

    if (reason.length > 500) {
      throw new ValidationError('reason cannot exceed 500 characters')
    }
  }

  /**
   * Validate resource creation request
   * @param {Object} data - Request data
   * @throws {ValidationError} if invalid
   */
  validateCreateResourceRequest(data) {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Request body must be an object')
    }

    const { name, type, description, departmentId, capacity, requiresApproval } = data

    // Validate required fields
    if (!name) {
      throw new ValidationError('name is required')
    }

    if (typeof name !== 'string' || name.trim() === '') {
      throw new ValidationError('name must be a non-empty string')
    }

    if (name.length > 100) {
      throw new ValidationError('name cannot exceed 100 characters')
    }

    if (!type) {
      throw new ValidationError('type is required')
    }

    if (typeof type !== 'string' || type.trim() === '') {
      throw new ValidationError('type must be a non-empty string')
    }

    // Validate optional fields
    if (description) {
      if (typeof description !== 'string') {
        throw new ValidationError('description must be a string')
      }

      if (description.length > 500) {
        throw new ValidationError('description cannot exceed 500 characters')
      }
    }

    if (departmentId) {
      this.validateUUID(departmentId, 'departmentId')
    }

    if (capacity !== undefined && capacity !== null) {
      if (!Number.isInteger(capacity) || capacity < 1 || capacity > 100) {
        throw new ValidationError('capacity must be an integer between 1 and 100')
      }
    }

    if (requiresApproval !== undefined && requiresApproval !== null) {
      if (typeof requiresApproval !== 'boolean') {
        throw new ValidationError('requiresApproval must be a boolean')
      }
    }
  }

  /**
   * Validate resource update request
   * @param {Object} data - Request data
   * @throws {ValidationError} if invalid
   */
  validateUpdateResourceRequest(data) {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Request body must be an object')
    }

    const { name, type, description, departmentId, capacity, requiresApproval, isActive } = data

    // At least one field must be provided
    if (Object.keys(data).length === 0) {
      throw new ValidationError('At least one field must be provided for update')
    }

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        throw new ValidationError('name must be a non-empty string')
      }

      if (name.length > 100) {
        throw new ValidationError('name cannot exceed 100 characters')
      }
    }

    if (type !== undefined) {
      if (typeof type !== 'string' || type.trim() === '') {
        throw new ValidationError('type must be a non-empty string')
      }
    }

    if (description !== undefined) {
      if (typeof description !== 'string') {
        throw new ValidationError('description must be a string')
      }

      if (description.length > 500) {
        throw new ValidationError('description cannot exceed 500 characters')
      }
    }

    if (departmentId !== undefined) {
      if (departmentId !== null) {
        this.validateUUID(departmentId, 'departmentId')
      }
    }

    if (capacity !== undefined) {
      if (capacity !== null) {
        if (!Number.isInteger(capacity) || capacity < 1 || capacity > 100) {
          throw new ValidationError('capacity must be an integer between 1 and 100')
        }
      }
    }

    if (requiresApproval !== undefined) {
      if (typeof requiresApproval !== 'boolean') {
        throw new ValidationError('requiresApproval must be a boolean')
      }
    }

    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        throw new ValidationError('isActive must be a boolean')
      }
    }
  }

  /**
   * Validate availability check request
   * @param {Object} query - Query parameters
   * @throws {ValidationError} if invalid
   */
  validateAvailabilityCheckRequest(query) {
    if (!query || typeof query !== 'object') {
      throw new ValidationError('Query parameters required')
    }

    const { startTime, endTime } = query

    if (!startTime) {
      throw new ValidationError('startTime query parameter is required')
    }

    if (!endTime) {
      throw new ValidationError('endTime query parameter is required')
    }

    this.validateDateTime(startTime, 'startTime')
    this.validateDateTime(endTime, 'endTime')
    this.validateTimeRange(startTime, endTime)
  }

  /**
   * Validate calendar request
   * @param {Object} query - Query parameters
   * @throws {ValidationError} if invalid
   */
  validateCalendarRequest(query) {
    if (!query || typeof query !== 'object') {
      throw new ValidationError('Query parameters required')
    }

    const { startDate, endDate } = query

    if (!startDate) {
      throw new ValidationError('startDate query parameter is required')
    }

    if (!endDate) {
      throw new ValidationError('endDate query parameter is required')
    }

    this.validateDate(startDate, 'startDate')
    this.validateDate(endDate, 'endDate')
    this.validateDateRange(startDate, endDate)
  }

  /**
   * Validate pagination parameters
   * @param {Object} query - Query parameters
   * @returns {Object} validated pagination params
   */
  validatePagination(query = {}) {
    const { skip = 0, take = 20 } = query

    const validatedSkip = Math.max(0, parseInt(skip, 10) || 0)
    const validatedTake = Math.min(100, Math.max(1, parseInt(take, 10) || 20))

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
      const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REJECTED']
      if (!validStatuses.includes(filters.status.toUpperCase())) {
        throw new ValidationError(`Invalid status filter: ${filters.status}`)
      }
      validated.status = filters.status.toUpperCase()
    }

    if (filters.employeeId) {
      this.validateUUID(filters.employeeId, 'employeeId filter')
      validated.employeeId = filters.employeeId
    }

    if (filters.resourceId) {
      this.validateUUID(filters.resourceId, 'resourceId filter')
      validated.resourceId = filters.resourceId
    }

    if (filters.type) {
      if (typeof filters.type !== 'string') {
        throw new ValidationError('type filter must be a string')
      }
      validated.type = filters.type
    }

    return validated
  }

  // Private validation helpers

  /**
   * Validate UUID format
   * @private
   */
  validateUUID(value, fieldName) {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (!uuidPattern.test(value)) {
      throw new ValidationError(`${fieldName} must be a valid UUID`)
    }
  }

  /**
   * Validate DateTime format
   * @private
   */
  validateDateTime(value, fieldName) {
    const date = new Date(value)

    if (isNaN(date.getTime())) {
      throw new ValidationError(`${fieldName} must be a valid ISO 8601 datetime`)
    }
  }

  /**
   * Validate Date format
   * @private
   */
  validateDate(value, fieldName) {
    const date = new Date(value)

    if (isNaN(date.getTime())) {
      throw new ValidationError(`${fieldName} must be a valid date`)
    }
  }

  /**
   * Validate time range
   * @private
   */
  validateTimeRange(startTime, endTime) {
    const start = new Date(startTime)
    const end = new Date(endTime)

    if (isNaN(start.getTime())) {
      throw new ValidationError('startTime must be a valid ISO 8601 datetime')
    }

    if (isNaN(end.getTime())) {
      throw new ValidationError('endTime must be a valid ISO 8601 datetime')
    }

    if (start >= end) {
      throw new ValidationError('startTime must be before endTime')
    }

    // Cannot book in past (allow 1 minute grace period for clock skew)
    const now = new Date()
    const gracePeriod = new Date(now.getTime() - 60000)
    if (start < gracePeriod) {
      throw new ValidationError('Cannot book in the past')
    }

    // Max duration: 7 days
    const maxDuration = 7 * 24 * 60 * 60 * 1000
    if (end.getTime() - start.getTime() > maxDuration) {
      throw new ValidationError('Booking cannot exceed 7 days')
    }

    // Minimum duration: 15 minutes
    const minDuration = 15 * 60 * 1000
    if (end.getTime() - start.getTime() < minDuration) {
      throw new ValidationError('Booking must be at least 15 minutes')
    }
  }

  /**
   * Validate date range
   * @private
   */
  validateDateRange(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime())) {
      throw new ValidationError('startDate must be a valid date')
    }

    if (isNaN(end.getTime())) {
      throw new ValidationError('endDate must be a valid date')
    }

    if (start > end) {
      throw new ValidationError('startDate must be before or equal to endDate')
    }

    // Prevent querying too far in past
    const minDate = new Date()
    minDate.setFullYear(minDate.getFullYear() - 1)
    if (start < minDate) {
      throw new ValidationError('Date range cannot query more than 1 year in the past')
    }

    // Max range: 90 days
    const maxRange = 90 * 24 * 60 * 60 * 1000
    if (end.getTime() - start.getTime() > maxRange) {
      throw new ValidationError('Date range cannot exceed 90 days')
    }
  }
}

export default new BookingValidator()
