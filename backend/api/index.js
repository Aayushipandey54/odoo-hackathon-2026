import { Router } from 'express'
import healthRouter from './health.js'
import authRouter from './auth.js'
import departmentRouter from './departments.js'
import employeeRouter from './employees.js'
import assetCategoryRouter from './assetCategories.js'
import assetRouter from './assets.js'
import allocationRouter from './allocations.js'
import transferRouter from './transfers.js'
import resourceRouter from './resources.js'
import bookingRouter from './bookings.js'
import maintenanceRouter from './maintenance.js'
import auditRouter from './audits.js'
import dashboardRouter from './dashboard.js'
import activityLogRouter from './activityLogs.js'
import notificationRouter from './notifications.js'
import reportRouter from './reports.js'

const router = Router()

// Infrastructure health routes
router.use('/health', healthRouter)

// Application Routes
router.use('/auth', authRouter)
router.use('/departments', departmentRouter)
router.use('/employees', employeeRouter)
router.use('/asset-categories', assetCategoryRouter)
router.use('/assets', assetRouter)
router.use('/allocations', allocationRouter)
router.use('/transfers', transferRouter)
router.use('/resources', resourceRouter)
router.use('/bookings', bookingRouter)
router.use('/maintenance', maintenanceRouter)
router.use('/audits', auditRouter)
router.use('/dashboard', dashboardRouter)
router.use('/activity-logs', activityLogRouter)
router.use('/notifications', notificationRouter)
router.use('/reports', reportRouter)

export default router
