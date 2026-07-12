import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserRepository from '../repositories/UserRepository.js'
import EmployeeRepository from '../repositories/EmployeeRepository.js'
import ActivityLogRepository from '../repositories/ActivityLogRepository.js'
import { NotFoundError, ValidationError, UnauthorizedError } from '../utils/errors.js'
import config from '../config/index.js'

export class AuthService {
  /**
   * Log an authentication activity
   */
  async logActivity(userId, action, details) {
    try {
      await ActivityLogRepository.create({
        userId,
        action,
        details,
        entityType: 'User',
        entityId: userId
      })
    } catch (err) {
      console.error('Failed to log auth activity:', err)
    }
  }

  /**
   * Generate access and refresh tokens
   */
  generateTokens(user) {
    const payload = { 
      id: user.id, 
      role: user.role,
      tokenVersion: user.tokenVersion 
    }

    const accessToken = jwt.sign(payload, config.jwtAccessSecret, {
      expiresIn: config.jwtAccessExpiration
    })
    
    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
      expiresIn: config.jwtRefreshExpiration
    })

    return { accessToken, refreshToken }
  }

  async register({ email, password, name, departmentId }) {
    const existing = await UserRepository.findOne({ email })
    if (existing) {
      throw new ValidationError('Email already registered')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await UserRepository.create({
      email,
      password: hashedPassword,
      role: 'EMPLOYEE'
    })

    let employee = null
    if (departmentId && name) {
      employee = await EmployeeRepository.create({
        userId: user.id,
        name,
        departmentId
      })
    }

    await this.logActivity(user.id, 'REGISTER', 'User registered successfully')

    return { user: { id: user.id, email: user.email, role: user.role }, employee }
  }

  async login({ email, password, ip, userAgent }) {
    const user = await UserRepository.findOne({ email })
    if (!user) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      await this.logActivity(user.id, 'LOGIN_FAILURE', `Failed login attempt from ${ip}`)
      throw new UnauthorizedError('Invalid credentials')
    }

    const { accessToken, refreshToken } = this.generateTokens(user)

    // Store hashed refresh token in database
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)
    await UserRepository.update(user.id, { refreshToken: hashedRefreshToken })

    await this.logActivity(user.id, 'LOGIN_SUCCESS', `Login from ${ip} via ${userAgent}`)

    return { 
      accessToken, 
      refreshToken, 
      user: { id: user.id, email: user.email, role: user.role } 
    }
  }

  async refresh({ refreshToken, ip }) {
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token required')
    }

    let payload
    try {
      payload = jwt.verify(refreshToken, config.jwtRefreshSecret)
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired refresh token')
    }

    const user = await UserRepository.findById(payload.id)
    if (!user || !user.refreshToken) {
      throw new UnauthorizedError('User session invalid')
    }

    // Compare token versions to invalidate old sessions immediately
    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedError('Session revoked')
    }

    // Verify hashed refresh token
    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken)
    if (!isMatch) {
      throw new UnauthorizedError('Refresh token reuse or invalid token detected')
    }

    // Generate new tokens (Rotation)
    const tokens = this.generateTokens(user)

    // Save new hashed refresh token
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10)
    await UserRepository.update(user.id, { refreshToken: hashedRefreshToken })

    await this.logActivity(user.id, 'TOKEN_REFRESH', `Token refreshed from ${ip}`)

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }
  }

  async logout(userId) {
    if (!userId) return
    // Invalidate refresh token
    await UserRepository.update(userId, { refreshToken: null })
    await this.logActivity(userId, 'LOGOUT', 'User logged out')
  }
}

export default new AuthService()
