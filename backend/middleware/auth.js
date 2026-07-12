import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import { UnauthorizedError } from '../utils/errors.js'
import { hasPermission } from './permissions.js'

/**
 * Validates the JWT Access token in the Authorization header.
 * Attaches the decoded user payload to req.user.
 */
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return next(new UnauthorizedError('No authentication token found'))
  }

  try {
    const decoded = jwt.verify(token, config.jwtAccessSecret)
    req.user = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token expired'))
    }
    return next(new UnauthorizedError('Invalid authentication token'))
  }
}

/**
 * Validates if the authenticated user's role has the requested generic permission.
 * Must be used AFTER authenticate middleware.
 */
export const requirePermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new UnauthorizedError('User identity could not be verified'))
    }

    const isAuthorized = hasPermission(req.user.role, requiredPermission)
    
    if (!isAuthorized) {
      return next(new UnauthorizedError(`Insufficient permissions. Requires: ${requiredPermission}`))
    }

    next()
  }
}

export default {
  authenticate,
  requirePermission
}
