import { Router } from 'express'
import { getAllLogs } from '../controllers/activityLogController.js'

const router = Router()

router.get('/', getAllLogs)

export default router
