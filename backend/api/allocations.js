import { Router } from 'express'
import { getAllAllocations, allocateAsset, returnAsset } from '../controllers/allocationController.js'

const router = Router()

router.get('/', getAllAllocations)
router.post('/', allocateAsset)
router.put('/:id/return', returnAsset)

export default router
