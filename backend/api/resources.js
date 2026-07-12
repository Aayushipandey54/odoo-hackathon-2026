import { Router } from 'express'
import { getAllResources, createResource, getResourceById, updateResource, deleteResource } from '../controllers/resourceController.js'

const router = Router()

router.get('/', getAllResources)
router.post('/', createResource)
router.get('/:id', getResourceById)
router.put('/:id', updateResource)
router.delete('/:id', deleteResource)

export default router
