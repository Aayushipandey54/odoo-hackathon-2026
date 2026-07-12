import { Router } from 'express'
import { getAllBookings, bookResource } from '../controllers/bookingController.js'

const router = Router()

router.get('/', getAllBookings)
router.post('/', bookResource)

export default router
