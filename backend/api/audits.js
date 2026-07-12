import { Router } from 'express'
import { authenticate, requirePermission } from '../middleware/auth.js'
import { PERMISSIONS } from '../middleware/permissions.js'
import {
  createAudit,
  getAllAudits,
  getAuditById,
  startAudit,
  verifyAsset,
  completeAudit,
  cancelAudit,
  getAuditReport,
  getAuditTimeline
} from '../controllers/auditController.js'

const router = Router()

// All audit routes require authentication
router.use(authenticate)

// Read operations
router.get('/',    requirePermission(PERMISSIONS.AUDIT_READ), getAllAudits)
router.get('/:id', requirePermission(PERMISSIONS.AUDIT_READ), getAuditById)

// Report & Timeline (read)
router.get('/:id/report',   requirePermission(PERMISSIONS.AUDIT_READ), getAuditReport)
router.get('/:id/timeline', requirePermission(PERMISSIONS.AUDIT_READ), getAuditTimeline)

// Write operations
router.post('/',             requirePermission(PERMISSIONS.AUDIT_CREATE),  createAudit)
router.post('/:id/start',   requirePermission(PERMISSIONS.AUDIT_MANAGE),  startAudit)
router.post('/:id/verify',  requirePermission(PERMISSIONS.AUDIT_VERIFY),  verifyAsset)
router.post('/:id/complete', requirePermission(PERMISSIONS.AUDIT_MANAGE), completeAudit)
router.post('/:id/cancel',  requirePermission(PERMISSIONS.AUDIT_MANAGE),  cancelAudit)

export default router
