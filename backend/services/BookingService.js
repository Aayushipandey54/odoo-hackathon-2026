import BookingRepository from '../repositories/BookingRepository.js'
import ActivityLogRepository from '../repositories/ActivityLogRepository.js'
import { ValidationError } from '../utils/errors.js'

export class BookingService {
  async getAll() {
    return BookingRepository.findAll({}, {
      include: { resource: true, employee: true }
    })
  }

  async book(resourceId, employeeId, startTime, endTime, userId) {
    // BUSINESS RULE: Conflict detection
    const conflicts = await BookingRepository.findAll({
      resourceId,
      status: { in: ['CONFIRMED', 'PENDING'] },
      OR: [
        { startTime: { lt: new Date(endTime), gte: new Date(startTime) } },
        { endTime: { gt: new Date(startTime), lte: new Date(endTime) } },
        { startTime: { lte: new Date(startTime) }, endTime: { gte: new Date(endTime) } }
      ]
    })

    if (conflicts.length > 0) {
      throw new ValidationError('Requested slot is unavailable - conflict detected')
    }

    const booking = await BookingRepository.create({
      resourceId, employeeId, startTime: new Date(startTime), endTime: new Date(endTime), status: 'CONFIRMED'
    })

    await ActivityLogRepository.create({
      action: 'RESOURCE_BOOKED',
      details: `Resource ${resourceId} booked`,
      entityId: booking.id,
      entityType: 'BOOKING',
      userId
    })

    return booking
  }
}

export default new BookingService()
