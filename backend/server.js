import app from './app.js'
import config from './config/index.js'
import { connectDB } from './core/index.js'

/**
 * Main server startup function. Triggering restart.
 */
async function startServer() {
  try {
    // 1. Establish connection to PostgreSQL database
    await connectDB()

    // 2. Start HTTP server
    app.listen(config.port, () => {
      console.log(`Server started in ${config.env} mode on port ${config.port}`)
      console.log(`Health status endpoint: http://localhost:${config.port}/api/health`)
    })
  } catch (err) {
    console.error('Fatal: Server startup failed:', err.message)
    process.exit(1)
  }
}

startServer()
