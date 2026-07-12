import { Router } from 'express'
import { getAllEmployees, createEmployee, getEmployeeById, updateEmployee, deleteEmployee } from '../controllers/employeeController.js'
import { authenticate, requirePermission } from '../middleware/auth.js'
import { validate } from '../utils/validation.js'
import { employeeSchema, employeeUpdateSchema } from '../validators/orgSchemas.js'

const router = Router()

router.use(authenticate)

router.get('/', requirePermission('asset:read'), getAllEmployees)
router.post('/', requirePermission('user:create'), validate(employeeSchema), createEmployee)
router.get('/:id', requirePermission('asset:read'), getEmployeeById)
router.put('/:id', requirePermission('user:update'), validate(employeeUpdateSchema), updateEmployee)
router.delete('/:id', requirePermission('user:delete'), deleteEmployee)

export default router
