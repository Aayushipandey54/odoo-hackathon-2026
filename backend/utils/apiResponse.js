/**
 * Standard API Response Structure
 * Use this helper to ensure consistent JSON responses across all endpoints.
 */

export class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {any} data - Response payload data
   * @param {string} message - Response message
   * @param {Object} meta - Optional metadata (e.g. pagination)
   * @param {Array|Object} errors - Optional validation errors or details
   */
  constructor(statusCode, data, message = 'Success', meta = null, errors = null) {
    this.success = statusCode >= 200 && statusCode < 400
    this.message = message
    this.data = data
    if (meta) this.meta = meta
    if (errors) this.errors = errors
  }
}

export default ApiResponse;
