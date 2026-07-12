import { ValidationError } from './errors.js'

/**
 * Generic Validation Middleware Factory
 * Uses standard JS validation or an external library like Joi/Zod if integrated later.
 * 
 * @param {Object} schema - Validation schema (function or object)
 * @param {string} source - Request property to validate ('body', 'query', 'params')
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      if (schema && typeof schema.safeParse === 'function') {
        // Zod validation
        const result = schema.safeParse(req[source])
        if (!result.success) {
          const details = {}
          result.error.issues.forEach(issue => {
            details[issue.path.join('.')] = issue.message
          })
          throw new ValidationError('Validation Failed', details)
        }
        // Replace with coerced/validated values
        req[source] = result.data
      } else if (typeof schema.validate === 'function') {
        // Joi validation (fallback)
        const { error, value } = schema.validate(req[source], { abortEarly: false })
        if (error) {
          const details = {}
          error.details.forEach(detail => {
            details[detail.path.join('.')] = detail.message
          })
          throw new ValidationError('Validation Failed', details)
        }
        req[source] = value
      } else {
        // Simple manual object validation stub (can be extended)
        if (!req[source] || Object.keys(req[source]).length === 0) {
          throw new ValidationError('Request payload is empty or invalid')
        }
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}

export default validate
