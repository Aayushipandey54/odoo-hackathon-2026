import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import { UnauthorizedError } from '../utils/errors.js'
import { hasPermission } from './permissions.js'
import { prisma } from '../core/connection.js'

/**
 * Validates the JWT Access token or dummy simulator token in the Authorization header.
 * Attaches the database user payload to req.user.
 */
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return next(new UnauthorizedError('No authentication token found'))
  }

  // 1. Support dummy token for testing & Phase 8 simulator swapper
  if (token.startsWith('dummy_token_')) {
    try {
      const userId = token.replace('dummy_token_', '')
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })
      if (!user) {
        return next(new UnauthorizedError('User not found for simulated token'))
      }
      req.user = user
      return next()
    } catch (err) {
      return next(new UnauthorizedError('Error resolving simulated token'))
    }
  }

  // 2. Standard JWT verification
  try {
    const decoded = jwt.verify(token, config.jwtAccessSecret)
    const userId = decoded.id || decoded.userId
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    if (!user) {
      return next(new UnauthorizedError('User not found'))
    }
    req.user = user
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

/**
 * Validates if the authenticated user has the ADMIN (Asset Manager) role.
 * Must be used AFTER authenticate middleware.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(new UnauthorizedError('Access denied: Requires Asset Manager (ADMIN) role'))
  }
  next()
}

// Export both default module and named imports for compatibility
export const auth = authenticate

export default {
  authenticate,
  auth,
  requirePermission,
  requireAdmin
}
