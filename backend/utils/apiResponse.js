/**
 * Standard API Response Structure
 * Use this helper to ensure consistent JSON responses across all endpoints.
 */

export class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {any} data - Response payload data
   * @param {string} message - Response message
   */
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode
    this.data = data
    this.message = message
    this.success = statusCode < 400
  }
}

export default ApiResponse;
