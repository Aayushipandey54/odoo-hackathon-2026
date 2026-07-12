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
  jwtSecret: process.env.JWT_SECRET || 'hackathon_jwt_super_secret_key_change_me',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  pagination: {
    defaultLimit: 10,
    maxLimit: 100
  }
}

export default config
