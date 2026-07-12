import { Router } from 'express'
import { getAllTransfers, requestTransfer, approveTransfer } from '../controllers/transferController.js'

const router = Router()

router.get('/', getAllTransfers)
router.post('/', requestTransfer)
router.put('/:id/approve', approveTransfer)

export default router
