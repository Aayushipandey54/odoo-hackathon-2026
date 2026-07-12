/**
 * Custom error classes for database-specific operations.
 */

export class DatabaseError extends Error {
  constructor(message, status = 500) {
    super(message)
    this.name = this.constructor.name
    this.status = status
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends DatabaseError {
  constructor(message = 'Record not found') {
    super(message, 404)
  }
}

export class DuplicateRecordError extends DatabaseError {
  constructor(message = 'Record already exists') {
    super(message, 409)
  }
}

export class DatabaseConnectionError extends DatabaseError {
  constructor(message = 'Database connection failed') {
    super(message, 503)
  }
}

export class ValidationError extends DatabaseError {
  constructor(message = 'Validation failed', errors = {}) {
    super(message, 400)
    this.errors = errors
  }
}

export class UnauthorizedError extends DatabaseError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
  }
}
