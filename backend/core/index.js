/**
 * Core infrastructure entrypoint.
 * Exposes core database primitives and architectural helpers.
 */

// Connection Primitives
export {
  connectDB,
  disconnectDB,
  transaction,
  isValidObjectId
} from './connection.js'

// BaseModel
export { BaseModelPlugin } from '../models/BaseModel.js'

// Generic Repository
export { GenericRepository } from '../repositories/GenericRepository.js'

// Database Error Classes
export {
  DatabaseError,
  NotFoundError,
  DuplicateRecordError,
  DatabaseConnectionError,
  ValidationError
} from '../utils/errors.js'

// Query & Pagination Utilities
export { paginate } from '../utils/pagination.js'
export { buildQuery } from '../utils/queryBuilder.js'
export { validateDocument } from '../utils/validation.js'

// Constants
export { COLLECTIONS } from './constants.js'
