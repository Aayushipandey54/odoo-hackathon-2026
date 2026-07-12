import { Router } from 'express'
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  getUpcomingBookings,
  getBookingById,
  approveBooking,
  rejectBooking,
  cancelBooking,
  modifyBooking,
  getBookingTimeline,
  getPendingApprovals,
  getBookingStatistics
} from '../controllers/bookingController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Specific routes BEFORE parameterized routes
// These must come first to avoid being matched as /:id
router.get('/pending/approvals', getPendingApprovals)
router.get('/stats', getBookingStatistics)
router.get('/my', getMyBookings)
router.get('/upcoming', getUpcomingBookings)

// Create booking
router.post('/', createBooking)

// Get all bookings (admin)
router.get('/', getAllBookings)

// Single booking endpoints (parameterized routes last)
router.get('/:id', getBookingById)

// Get booking timeline
router.get('/:id/timeline', getBookingTimeline)

// Approve booking
router.put('/:id/approve', approveBooking)

// Reject booking
router.put('/:id/reject', rejectBooking)

// Modify booking
router.put('/:id/modify', modifyBooking)

// Cancel booking
router.put('/:id/cancel', cancelBooking)

export default router
