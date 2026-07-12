import { Router } from 'express'
import { getAllAudits, createAuditCycle, verifyAuditItem, closeAuditCycle } from '../controllers/auditController.js'

const router = Router()

router.get('/', getAllAudits)
router.post('/', createAuditCycle)
router.post('/verify', verifyAuditItem)
router.put('/:id/close', closeAuditCycle)

export default router
