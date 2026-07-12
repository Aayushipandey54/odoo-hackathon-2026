import { Router } from 'express'
import { getAllLocations, createLocation, getLocationById, updateLocation, deleteLocation } from '../controllers/locationController.js'
import { authenticate, requirePermission } from '../middleware/auth.js'
import { validate } from '../utils/validation.js'
import { locationSchema, locationUpdateSchema } from '../validators/orgSchemas.js'

const router = Router()

router.use(authenticate)

router.get('/', requirePermission('asset:read'), getAllLocations)
router.post('/', requirePermission('asset:create'), validate(locationSchema), createLocation)
router.get('/:id', requirePermission('asset:read'), getLocationById)
router.put('/:id', requirePermission('asset:update'), validate(locationUpdateSchema), updateLocation)
router.delete('/:id', requirePermission('asset:delete'), deleteLocation)

export default router
