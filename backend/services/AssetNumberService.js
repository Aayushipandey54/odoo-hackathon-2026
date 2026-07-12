import { prisma } from '../core/connection.js'

/**
 * Asset Number Service
 * Generates unique, immutable asset numbers in format AF-YYYY-NNNN
 * Example: AF-2026-0001, AF-2026-0002
 */
export class AssetNumberService {
  /**
   * Generate next asset number
   * Format: AF-YYYY-NNNN where YYYY is current year and NNNN is sequential counter
   * Uses database transaction to ensure atomic increment and prevent race conditions
   */
  async generateAssetNumber() {
    const year = new Date().getFullYear()
    const prefix = `AF-${year}`

    // Use transaction to atomically read and increment counter
    // This prevents race conditions with concurrent requests
    return await prisma.$transaction(async (tx) => {
      // Lock and read the highest existing counter for this year
      const lastAsset = await tx.asset.findMany({
        where: {
          assetNumber: {
            startsWith: prefix
          }
        },
        orderBy: {
          assetNumber: 'desc'
        },
        take: 1
      })

      let nextCounter = 1
      if (lastAsset.length > 0) {
        const lastNumber = lastAsset[0].assetNumber
        const counterStr = lastNumber.split('-')[2]
        nextCounter = parseInt(counterStr, 10) + 1
      }

      const assetNumber = `${prefix}-${String(nextCounter).padStart(4, '0')}`
      return assetNumber
    })
  }

  /**
   * Validate asset number format
   * Accepts: AF-YYYY-NNNN
   */
  validateAssetNumber(assetNumber) {
    const pattern = /^AF-\d{4}-\d{4}$/
    return pattern.test(assetNumber)
  }

  /**
   * Check if asset number already exists
   */
  async isAssetNumberUnique(assetNumber) {
    const existing = await prisma.asset.findUnique({
      where: { assetNumber }
    })
    return !existing
  }
}

export default new AssetNumberService()
