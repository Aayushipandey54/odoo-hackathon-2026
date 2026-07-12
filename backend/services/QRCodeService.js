import QRCode from 'qrcode'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * QR Code Service
 * Generates and manages QR codes for assets
 * QR code encodes only asset ID or asset number, not sensitive metadata
 */
export class QRCodeService {
  constructor() {
    this.qrDir = path.join(__dirname, '../uploads/qrcodes')
  }

  /**
   * Initialize uploads directory
   */
  async initializeDirectories() {
    try {
      await fs.mkdir(this.qrDir, { recursive: true })
    } catch (error) {
      console.error('Error creating QR code directory:', error)
    }
  }

  /**
   * Generate QR code for asset
   * Returns file URL (not base64 to avoid data leaks)
   */
  async generateQRCode(assetId, assetNumber) {
    try {
      if (!assetId) {
        throw new Error('assetId is required to generate QR code')
      }
      return await this.generateQRCodeFile(assetId, assetNumber)
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error.message}`)
    }
  }

  /**
   * Generate QR code and save as file
   */
  async generateQRCodeFile(assetId, assetNumber) {
    try {
      await this.initializeDirectories()

      const qrData = assetId
      const filename = `${assetNumber}.png`
      const filepath = path.join(this.qrDir, filename)

      // Generate QR code as file
      await QRCode.toFile(filepath, qrData, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      // Return relative path for storage
      return `/uploads/qrcodes/${filename}`
    } catch (error) {
      throw new Error(`Failed to generate QR code file: ${error.message}`)
    }
  }

  /**
   * Regenerate QR code for existing asset
   */
  async regenerateQRCode(assetId, assetNumber) {
    try {
      const oldPath = path.join(this.qrDir, `${assetNumber}.png`)

      // Delete old QR code if exists
      try {
        await fs.unlink(oldPath)
      } catch (error) {
        // File may not exist, ignore
      }

      // Generate new QR code
      return await this.generateQRCodeFile(assetId, assetNumber)
    } catch (error) {
      throw new Error(`Failed to regenerate QR code: ${error.message}`)
    }
  }

  /**
   * Validate QR code data
   */
  validateQRData(data) {
    // QR code should contain valid UUID format
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidPattern.test(data)
  }
}

export default new QRCodeService()
