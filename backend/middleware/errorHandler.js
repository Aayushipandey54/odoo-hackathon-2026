import { ApiResponse } from '../utils/apiResponse.js'

/**
 * 404 Not Found Middleware.
 * Captures requests to undefined routes.
 */
export function notFoundHandler(req, res, next) {
  const err = new Error(`Route Not Found - ${req.originalUrl}`)
  err.status = 404
  next(err)
}

/**
 * Global Error Handling Middleware.
 * Prevents stack trace leakages in production environment.
 */
export function errorHandler(err, req, res, _next) {
  console.error('[DATABASE/SERVER ERROR]:', err)

  const isProduction = process.env.NODE_ENV === 'production'

  let status = err.status || 500
  let message = err.message || 'Internal Server Error'
  let errors = err.errors || undefined

  // Handle Prisma errors
  if (err.code) {
    if (err.code === 'P2002') {
      status = 409
      message = 'Duplicate record found'
    } else if (err.code === 'P2025') {
      status = 404
      message = 'Record not found'
    } else if (err.code === 'P2003') {
      status = 400
      message = 'Foreign key constraint failed'
    }
  }

  // Handle generic validation errors (if thrown manually)
  if (err.name === 'ValidationError') {
    status = 400
    message = 'Validation failed'
    errors = err.details || err.errors
  }

  // Use ApiResponse format
  const response = new ApiResponse(
    status,
    null,
    message,
    isProduction ? null : { stack: err.stack },
    errors
  )

  res.status(status).json(response)
}

export default errorHandler
