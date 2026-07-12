import { Router } from 'express'
import { getAllMaintenanceRequests, createMaintenanceRequest, updateMaintenanceStatus } from '../controllers/maintenanceController.js'

const router = Router()

router.get('/', getAllMaintenanceRequests)
router.post('/', createMaintenanceRequest)
router.put('/:id/status', updateMaintenanceStatus)

export default router
