import mongoose from 'mongoose'

/**
 * Health check controller checking status of the server and active database connection.
 */
export const getHealth = async (req, res, next) => {
  try {
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const dbState = mongoose.connection.readyState
    const states = ['DISCONNECTED', 'CONNECTED', 'CONNECTING', 'DISCONNECTING']
    const dbStatus = states[dbState] || 'UNKNOWN'

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
