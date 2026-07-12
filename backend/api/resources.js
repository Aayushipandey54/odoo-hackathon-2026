import { Router } from 'express'
import {
  getAllResources,
  getActiveResources,
  createResource,
  getResourceById,
  updateResource,
  deleteResource,
  getResourcesByDepartment,
  getResourcesByType,
  getResourceAvailability,
  getResourceCalendar,
  getAvailableSlots,
  toggleResourceStatus,
  getResourceStatistics,
  searchResources
} from '../controllers/resourceController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Get all resources
router.get('/', getAllResources)

// Get active resources (specific before parameterized)
router.get('/active', getActiveResources)

// Search resources (specific before parameterized)
router.get('/search', searchResources)

// Create resource
router.post('/', createResource)

// Get resources by department (specific pattern)
router.get('/department/:departmentId', getResourcesByDepartment)

// Get resources by type (specific pattern)
router.get('/type/:type', getResourcesByType)

// Single resource endpoints (general :id patterns last)
router.get('/:id', getResourceById)

// Get resource availability
router.get('/:id/availability', getResourceAvailability)

// Get resource calendar
router.get('/:id/calendar', getResourceCalendar)

// Get available slots
router.get('/:id/slots', getAvailableSlots)

// Get resource statistics
router.get('/:id/stats', getResourceStatistics)

// Update resource
router.put('/:id', updateResource)

// Toggle resource status
router.put('/:id/toggle-status', toggleResourceStatus)

// Delete resource
router.delete('/:id', deleteResource)

export default router
