/**
 * Transaction Wrapper Utility
 * Provides consistent transaction handling across all services
 * Ensures atomicity and proper error handling
 */

import { prisma } from '../core/connection.js'

/**
 * Execute callback within a database transaction
 * @param {Function} callback - Async function to execute in transaction
 * @param {Object} options - Transaction options
 * @returns {Promise} result from callback
 * @throws {Error} if transaction fails
 *
 * @example
 * const result = await executeInTransaction(async (tx) => {
 *   const allocation = await tx.assetAllocation.create({ data })
 *   await tx.asset.update({ where: { id }, data: { status } })
 *   return allocation
 * })
 */
export async function executeInTransaction(callback, options = {}) {
  const {
    isolationLevel = 'Serializable', // ACID isolation
    maxWait = 5000, // 5 seconds max wait
    timeout = 10000 // 10 seconds timeout
  } = options

  try {
    const result = await prisma.$transaction(callback, {
      isolationLevel,
      maxWait,
      timeout
    })

    return result
  } catch (error) {
    // Automatically rolled back by Prisma on error
    throw handleTransactionError(error)
  }
}

/**
 * Handle transaction-specific errors
 * @param {Error} error - Transaction error
 * @returns {Error} enhanced error
 * @private
 */
function handleTransactionError(error) {
  // Timeout error
  if (error.code === 'P2024') {
    const timeoutError = new Error('Transaction timeout - too many concurrent operations')
    timeoutError.code = 'TRANSACTION_TIMEOUT'
    timeoutError.status = 503
    return timeoutError
  }

  // Database connection error
  if (error.code === 'P1000' || error.code === 'P1001') {
    const connError = new Error('Database connection failed')
    connError.code = 'DB_CONNECTION_ERROR'
    connError.status = 503
    return connError
  }

  // Foreign key constraint violation
  if (error.code === 'P2003') {
    const fkError = new Error('Referenced record does not exist')
    fkError.code = 'FOREIGN_KEY_VIOLATION'
    fkError.status = 400
    return fkError
  }

  // Unique constraint violation
  if (error.code === 'P2002') {
    const uniqueError = new Error('Record with this value already exists')
    uniqueError.code = 'UNIQUE_VIOLATION'
    uniqueError.status = 409
    return uniqueError
  }

  // Check constraint violation
  if (error.code === 'P2012') {
    const checkError = new Error('Constraint violation: invalid data')
    checkError.code = 'CHECK_VIOLATION'
    checkError.status = 400
    return checkError
  }

  // Unknown Prisma error
  if (error.code && error.code.startsWith('P')) {
    const prismaError = new Error(`Database error: ${error.message}`)
    prismaError.code = error.code
    prismaError.status = 500
    return prismaError
  }

  // Non-Prisma error, pass through
  return error
}

/**
 * Execute nested transactions (not supported by Prisma)
 * Use savepoints instead
 * @param {Function} callback - Function to execute
 * @returns {Promise} result from callback
 *
 * @example
 * // If inside a transaction, this will use savepoint
 * const result = await executeWithSavepoint(async (tx) => {
 *   // nested transaction logic
 * })
 */
export async function executeWithSavepoint(callback) {
  // Prisma handles savepoints automatically for nested $transaction calls
  return executeInTransaction(callback)
}

/**
 * Check transaction status
 * @returns {Object} transaction info
 */
export function getTransactionInfo() {
  return {
    supported: true,
    isolationLevels: [
      'Serializable',
      'RepeatableRead',
      'ReadCommitted',
      'ReadUncommitted'
    ],
    provider: 'PostgreSQL'
  }
}

export default {
  executeInTransaction,
  executeWithSavepoint,
  getTransactionInfo
}
