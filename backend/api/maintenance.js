import { Router } from 'express'
import {
  getAllMaintenanceRequests,
  getMaintenanceRequestById,
  createMaintenanceRequest,
  approveMaintenanceRequest,
  rejectMaintenanceRequest,
  assignTechnician,
  startMaintenance,
  resolveMaintenance,
  closeMaintenance
} from '../controllers/maintenanceController.js'
import { auth, requireAdmin } from '../middleware/auth.js'

const router = Router()

// All maintenance routes require authentication
router.use(auth)

router.get('/', getAllMaintenanceRequests)
router.post('/', createMaintenanceRequest)
router.get('/:id', getMaintenanceRequestById)

// Administrative actions (Asset Manager only)
router.put('/:id/approve', requireAdmin, approveMaintenanceRequest)
router.put('/:id/reject', requireAdmin, rejectMaintenanceRequest)
router.put('/:id/assign', requireAdmin, assignTechnician)

// Service execution actions (Technician/Staff)
router.put('/:id/start', startMaintenance)
router.put('/:id/resolve', resolveMaintenance)
router.put('/:id/close', closeMaintenance)

export default router
