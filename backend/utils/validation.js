import { ValidationError } from './errors.js'

/**
 * Validates a schema document or payload using native mongoose validation checks.
 * @param {import('mongoose').Document} documentInstance
 * @throws {ValidationError}
 */
export async function validateDocument(documentInstance) {
  try {
    await documentInstance.validate()
  } catch (err) {
    const errorDetails = {}
    if (err.errors) {
      Object.keys(err.errors).forEach(key => {
        errorDetails[key] = err.errors[key].message
      })
    }
    throw new ValidationError(err.message, errorDetails)
  }
}
