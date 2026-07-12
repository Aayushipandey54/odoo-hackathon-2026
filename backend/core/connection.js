import pkg from '@prisma/client'
const { PrismaClient } = pkg
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import dotenv from 'dotenv'
import { DatabaseConnectionError } from '../utils/errors.js'

dotenv.config()

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter })

/**
 * Connect to PostgreSQL instance.
 * @returns {Promise<PrismaClient>}
 */
export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('Database Connected successfully via Prisma adapter')
    return prisma
  } catch (err) {
    console.error('Database connection error:', err.message)
    throw new DatabaseConnectionError(`Failed to connect to Database: ${err.message}`)
  }
}

/**
 * Disconnect from the active database.
 * @returns {Promise<void>}
 */
export async function disconnectDB() {
  try {
    await prisma.$disconnect()
    console.log('Database Disconnected successfully')
  } catch (err) {
    console.error('Database disconnect error:', err.message)
  }
}

/**
 * Helper to run operations in a transaction.
 * @param {Function} fn - Transaction callback.
 * @returns {Promise<any>}
 */
export async function transaction(fn) {
  try {
    return await prisma.$transaction(fn)
  } catch (err) {
    console.error('Database Transaction aborted due to error:', err.message)
    throw err
  }
}

/**
 * Checks if a string value is a valid ID.
 * @param {string} id
 * @returns {boolean}
 */
export function isValidObjectId(id) {
  // Check if string is non-empty (PostgreSQL uses UUIDs or standard IDs)
  return typeof id === 'string' && id.trim().length > 0
}
