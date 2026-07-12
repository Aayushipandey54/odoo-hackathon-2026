import { prisma } from '../core/connection.js'
import { NotFoundError, ValidationError } from '../utils/errors.js'

/**
 * VerificationService — Handles individual asset verification within an active audit.
 *
 * Responsibilities:
 *   - Verify an asset's physical presence, condition, and location
 *   - Automatically create discrepancies for non-VERIFIED statuses
 *   - Preserve change history (never overwrite — insert new activity logs)
 */
export class VerificationService {

  static VALID_STATUSES = ['VERIFIED', 'MISSING', 'DAMAGED', 'NOT_FOUND']

  static DISCREPANCY_MAP = {
    MISSING: { type: 'MISSING_ASSET', severity: 'CRITICAL' },
    DAMAGED: { type: 'DAMAGED_ASSET', severity: 'HIGH' },
    NOT_FOUND: { type: 'MISSING_ASSET', severity: 'CRITICAL' }
  }

  /**
   * Verify a single asset within an audit cycle.
   */
  async verifyAsset(auditId, data, userId) {
    const { assetId, verification, remarks, actualLocation } = data

    // Validate inputs
    if (!assetId || !verification) {
      throw new ValidationError('assetId and verification status are required')
    }

    if (!VerificationService.VALID_STATUSES.includes(verification)) {
      throw new ValidationError(`Invalid verification status. Must be one of: ${VerificationService.VALID_STATUSES.join(', ')}`)
    }

    return await prisma.$transaction(async (tx) => {
      // Verify the audit exists and is ACTIVE
      const audit = await tx.auditCycle.findUnique({ where: { id: auditId } })
      if (!audit || audit.deletedAt) {
        throw new NotFoundError(`Audit cycle not found for id "${auditId}"`)
      }
      if (audit.status !== 'ACTIVE') {
        throw new ValidationError(`Cannot verify assets. Audit status is "${audit.status}". Must be ACTIVE.`)
      }

      // Find the audit item for this asset
      const auditItem = await tx.auditItem.findFirst({
        where: { auditCycleId: auditId, assetId, deletedAt: null }
      })

      if (!auditItem) {
        throw new NotFoundError(`Asset "${assetId}" is not part of audit "${auditId}"`)
      }

      // If already verified, log the re-verification as change history
      if (auditItem.verification) {
        await tx.activityLog.create({
          data: {
            action: 'AUDIT_REVERIFICATION',
            details: `Asset re-verified. Previous: ${auditItem.verification} → New: ${verification}. Previous remarks: "${auditItem.remarks || 'none'}"`,
            entityId: auditItem.id,
            entityType: 'AUDIT_ITEM',
            userId
          }
        })
      }

      // Update the audit item
      const updatedItem = await tx.auditItem.update({
        where: { id: auditItem.id },
        data: {
          verification,
          remarks: remarks || null,
          actualLocation: actualLocation || null,
          verifiedAt: new Date(),
          verifiedById: userId
        },
        include: {
          asset: { select: { id: true, name: true, assetNumber: true, tag: true } }
        }
      })

      // Auto-create discrepancy for non-VERIFIED statuses
      let discrepancy = null
      if (verification !== 'VERIFIED') {
        const discType = VerificationService.DISCREPANCY_MAP[verification]

        // Check for location mismatch
        const isLocationMismatch = actualLocation && actualLocation !== auditItem.expectedLocation
        const finalType = isLocationMismatch ? 'INCORRECT_LOCATION' : discType.type
        const finalSeverity = isLocationMismatch ? 'MEDIUM' : discType.severity

        discrepancy = await tx.auditDiscrepancy.create({
          data: {
            auditCycleId: auditId,
            auditItemId: auditItem.id,
            assetId,
            type: finalType,
            severity: finalSeverity,
            description: `Asset ${updatedItem.asset.assetNumber} (${updatedItem.asset.name}): ${verification}${remarks ? ` — ${remarks}` : ''}${isLocationMismatch ? ` | Location mismatch: expected "${auditItem.expectedLocation}", found "${actualLocation}"` : ''}`,
            status: 'OPEN'
          }
        })

        await tx.activityLog.create({
          data: {
            action: 'DISCREPANCY_CREATED',
            details: `Discrepancy: ${finalType} (${finalSeverity}) for asset ${updatedItem.asset.assetNumber}`,
            entityId: discrepancy.id,
            entityType: 'AUDIT_DISCREPANCY',
            userId
          }
        })
      }

      // Log the verification event
      const actionName = verification === 'VERIFIED' ? 'ASSET_VERIFIED' : `ASSET_${verification}`
      await tx.activityLog.create({
        data: {
          action: actionName,
          details: `Asset ${updatedItem.asset.assetNumber} verified as ${verification}${remarks ? ` — ${remarks}` : ''}`,
          entityId: auditItem.id,
          entityType: 'AUDIT_ITEM',
          userId
        }
      })

      return { item: updatedItem, discrepancy }
    })
  }
}

export default new VerificationService()
