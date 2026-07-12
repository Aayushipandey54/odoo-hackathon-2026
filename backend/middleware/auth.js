import config from '../config/index.js'
import { UnauthorizedError } from '../utils/errors.js'

export const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return next(new UnauthorizedError('No authentication token found'))
  }

  // Simplified token verification for hackathon (dummy tokens format: dummy_token_{userId})
  if (token.startsWith('dummy_token_')) {
    const userId = token.replace('dummy_token_', '')
    req.user = { id: userId, role: 'EMPLOYEE' } // Could fetch from DB for accurate role
    next()
  } else {
    next(new UnauthorizedError('Invalid authentication token'))
  }
}

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return next(new UnauthorizedError('Admin access required'))
  }
  next()
}
