import { Router } from 'express'
import { getAllDepartments, createDepartment, getDepartmentById, updateDepartment, deleteDepartment } from '../controllers/departmentController.js'
import { authenticate, requirePermission } from '../middleware/auth.js'
import { validate } from '../utils/validation.js'
import { departmentSchema, departmentUpdateSchema } from '../validators/orgSchemas.js'

const router = Router()

router.use(authenticate)

router.get('/', requirePermission('asset:read'), getAllDepartments)
router.post('/', requirePermission('asset:create'), validate(departmentSchema), createDepartment)
router.get('/:id', requirePermission('asset:read'), getDepartmentById)
router.put('/:id', requirePermission('asset:update'), validate(departmentUpdateSchema), updateDepartment)
router.delete('/:id', requirePermission('asset:delete'), deleteDepartment)

export default router
