import { Router } from 'express'
import { getAllDepartments, createDepartment, getDepartmentById, updateDepartment, deleteDepartment } from '../controllers/departmentController.js'

const router = Router()

router.get('/', getAllDepartments)
router.post('/', createDepartment)
router.get('/:id', getDepartmentById)
router.put('/:id', updateDepartment)
router.delete('/:id', deleteDepartment)

export default router
