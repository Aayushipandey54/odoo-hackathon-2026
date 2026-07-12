import { Router } from 'express'
import { getOrganizationSettings, updateOrganizationSettings } from '../controllers/organizationController.js'
import { authenticate, requirePermission } from '../middleware/auth.js'
import { validate } from '../utils/validation.js'
import { organizationSettingsUpdateSchema } from '../validators/orgSchemas.js'

const router = Router()

router.use(authenticate)

router.get('/', requirePermission('dashboard:access'), getOrganizationSettings)
router.put('/', requirePermission('asset:update'), validate(organizationSettingsUpdateSchema), updateOrganizationSettings)

export default router
