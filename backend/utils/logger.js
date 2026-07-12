/**
 * Application Logger Utility
 * Provides a standardized logging interface for the application.
 */

const getTimestamp = () => new Date().toISOString();

export const logger = {
  info: (message, meta = {}) => {
    console.log(`[INFO] ${getTimestamp()} - ${message}`, Object.keys(meta).length ? meta : '');
  },
  error: (message, error = null) => {
    console.error(`[ERROR] ${getTimestamp()} - ${message}`);
    if (error) {
      console.error(error);
    }
  },
  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${getTimestamp()} - ${message}`, Object.keys(meta).length ? meta : '');
  },
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${getTimestamp()} - ${message}`, Object.keys(meta).length ? meta : '');
    }
  }
};

export default logger;
