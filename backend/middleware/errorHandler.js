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
    errors = err.errors
  }

  res.status(status).json({
    success: false,
    message,
    errors,
    stack: isProduction ? undefined : err.stack,
  })
}

export default errorHandler
