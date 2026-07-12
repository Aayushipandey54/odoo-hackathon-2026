import { prisma } from '../core/connection.js'

/**
 * Health check controller checking status of the server and active database connection.
 */
export const getHealth = async (req, res, next) => {
  try {
    let dbStatus = 'DISCONNECTED'
    
    try {
      // Ping database
      await prisma.$queryRaw`SELECT 1`
      dbStatus = 'CONNECTED'
    } catch (e) {
      dbStatus = 'DISCONNECTED'
    }

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      status: 'UP',
      services: {
        server: 'UP',
        database: dbStatus,
      },
    })
  } catch (err) {
    next(err)
  }
}
