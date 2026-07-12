/**
 * General helper utilities for the application.
 */

/**
 * Formats a number as Indian Rupees (INR)
 * @param {number} value
 * @returns {string}
 */
export function formatINR(value) {
  if (value === undefined || value === null) return ''
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Formats a percentage value
 * @param {number} value
 * @returns {string}
 */
export function formatPercentage(value) {
  if (value === undefined || value === null) return ''
  return `${value}%`
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
