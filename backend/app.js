import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import config from './config/index.js'
import routes from './api/index.js'
import apiLimiter from './middleware/rateLimiter.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()

// 1. Apply Security headers via Helmet
app.use(helmet())

// 2. Configure CORS middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}))

// 3. JSON and URLencoded parsers with payloads limit
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 4. Register rate limiter for API routes
app.use('/api', apiLimiter)

// 5. Connect API routes
app.use('/api', routes)

// 6. Handle undefined API routes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
})

// 7. Handle global server errors
app.use(errorHandler)

export default app
