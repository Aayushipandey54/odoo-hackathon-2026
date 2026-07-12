import dotenv from 'dotenv'

dotenv.config()

const requiredEnv = ['DATABASE_URL']

if (process.env.NODE_ENV === 'production') {
  requiredEnv.forEach(key => {
    if (!process.env[key]) {
      console.warn(`[WARNING] Missing environment variable: ${key}`)
    }
  })
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  env: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'hackathon_jwt_access_secret_key',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'hackathon_jwt_refresh_secret_key',
  jwtAccessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  pagination: {
    defaultLimit: 10,
    maxLimit: 100
  }
}

export default config
