import { Router } from 'express'
import { register, login, refresh, logout } from '../controllers/authController.js'
import { validate } from '../utils/validation.js'
import { authenticate } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// Basic auth validation stubs (can be replaced with Joi/Zod if integrated)
const loginSchema = {
  validate: (data) => {
    if (!data.email || !data.password) {
      return { error: { details: [{ path: ['credentials'], message: 'Email and password are required' }] } }
    }
    return { value: data }
  }
}

const registerSchema = {
  validate: (data) => {
    if (!data.email || !data.password) {
      return { error: { details: [{ path: ['credentials'], message: 'Email and password are required' }] } }
    }
    return { value: data }
  }
}

const refreshSchema = {
  validate: (data) => {
    if (!data.refreshToken) {
      return { error: { details: [{ path: ['refreshToken'], message: 'Refresh token is required' }] } }
    }
    return { value: data }
  }
}

router.post('/register', authLimiter, validate(registerSchema, 'body'), register)
router.post('/login', authLimiter, validate(loginSchema, 'body'), login)
router.post('/refresh', authLimiter, validate(refreshSchema, 'body'), refresh)

// Protected endpoints
router.post('/logout', authenticate, logout)

export default router
