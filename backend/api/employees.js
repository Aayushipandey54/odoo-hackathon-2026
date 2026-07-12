import { Router } from 'express'
import { getAllEmployees, createEmployee, getEmployeeById, updateEmployee, deleteEmployee } from '../controllers/employeeController.js'

const router = Router()

router.get('/', getAllEmployees)
router.post('/', createEmployee)
router.get('/:id', getEmployeeById)
router.put('/:id', updateEmployee)
router.delete('/:id', deleteEmployee)

export default router
