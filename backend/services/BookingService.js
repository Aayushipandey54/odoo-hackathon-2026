/**
 * Booking Service
 * Manages resource booking lifecycle with workflow integration
 * Handles creation, approval, cancellation, modification
 */

import { prisma } from '../core/connection.js'
import BookingRepository from '../repositories/BookingRepository.js'
import AvailabilityService from './AvailabilityService.js'
import BookingTimelineService, { BOOKING_TIMELINE_EVENTS } from './BookingTimelineService.js'
import DomainEventService from './DomainEventService.js'
import NotificationService from './NotificationService.js'
import { ValidationError, NotFoundError, ConflictError } from '../utils/errors.js'

export class BookingService {
  /**
   * Create new booking
   * @param {Object} data - Booking data
   * @param {string} data.resourceId - Resource ID
   * @param {string} data.employeeId - Employee ID
   * @param {Date} data.startTime - Start time
   * @param {Date} data.endTime - End time
   * @param {string} data.purpose - Booking purpose (optional)
   * @param {string} userId - User creating booking
   * @returns {Promise<Object>} - Created booking
   * @throws {ValidationError, ConflictError}
   */
  async createBooking(data, userId) {
    const { resourceId, employeeId, startTime, endTime, purpose } = data

    // Step 1: Verify resource exists and is active
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId }
    })

    if (!resource) {
      throw new NotFoundError(`Resource ${resourceId} not found`)
    }

    if (!resource.isActive) {
      throw new ValidationError(`Resource ${resource.name} is not available for booking`)
    }

    // Step 2: Verify employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { department: true }
    })

    if (!employee) {
      throw new NotFoundError(`Employee ${employeeId} not found`)
    }

    // Step 3: Check availability
    const isAvailable = await AvailabilityService.isAvailable(resourceId, startTime, endTime)

    if (!isAvailable) {
      throw new ConflictError('Requested time slot is unavailable - booking conflict detected')
    }

    // Step 4: Create booking in transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Create booking record
      const newBooking = await tx.resourceBooking.create({
        data: {
          resourceId,
          employeeId,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          purpose: purpose || null,
          status: resource.requiresApproval ? 'PENDING' : 'CONFIRMED',
          createdBy: userId
        },
        include: {
          resource: true,
          employee: { include: { department: true } }
        }
      })

      return newBooking
    })

    // Step 5: Create timeline event
    await BookingTimelineService.createEvent(
      booking.id,
      BOOKING_TIMELINE_EVENTS.CREATED,
      `Booking created for ${resource.name} from ${new Date(startTime).toISOString()} to ${new Date(endTime).toISOString()}`,
      userId,
      {
        resourceName: resource.name,
        employeeName: employee.name,
        departmentName: employee.department?.name
      }
    )

    // Step 6: Emit domain event
    DomainEventService.emit('BOOKING_CREATED', {
      aggregateId: booking.id,
      userId,
      data: {
        bookingId: booking.id,
        resourceId,
        employeeId,
        resourceName: resource.name,
        employeeName: employee.name,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        purpose,
        status: booking.status
      }
    })

    // Step 7: Send notifications
    if (resource.requiresApproval) {
      // Notify approvers (department head)
      if (employee.department?.headId) {
        await NotificationService.createNotification({
          type: 'APPROVAL',
          message: `Booking request for ${resource.name} from ${employee.name} pending approval`,
          userId: employee.department.headId
        })
      }
    } else {
      // Notify employee of confirmation
      await NotificationService.createNotification({
        type: 'BOOKING',
        message: `Your booking for ${resource.name} has been confirmed`,
        userId: employeeId
      })
    }

    return booking
  }

  /**
   * Approve pending booking
   * @param {string} bookingId - Booking ID
   * @param {string} approverId - Approver user ID
   * @param {string} comments - Approval comments (optional)
   * @returns {Promise<Object>} - Updated booking
   * @throws {ValidationError, NotFoundError}
   */
  async approveBooking(bookingId, approverId, comments = null) {
    if (!bookingId) {
      throw new ValidationError('bookingId is required')
    }

    if (!approverId) {
      throw new ValidationError('approverId is required')
    }

    // Step 1: Get booking
    const booking = await prisma.resourceBooking.findUnique({
      where: { id: bookingId },
      include: {
        resource: true,
        employee: { include: { department: true } }
      }
    })

    if (!booking) {
      throw new NotFoundError(`Booking ${bookingId} not found`)
    }

    if (booking.status !== 'PENDING') {
      throw new ValidationError(`Cannot approve booking with status ${booking.status}`)
    }

    // Step 2: Verify availability still holds (double-check)
    const isAvailable = await AvailabilityService.isAvailable(
      booking.resourceId,
      booking.startTime,
      booking.endTime,
      bookingId
    )

    if (!isAvailable) {
      throw new ConflictError('Booking time slot is no longer available')
    }

    // Step 3: Update booking status
    const updated = await prisma.resourceBooking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        approvedBy: approverId,
        approvedAt: new Date()
      },
      include: {
        resource: true,
        employee: { include: { department: true } }
      }
    })

    // Step 4: Create timeline event
    await BookingTimelineService.createEvent(
      bookingId,
      BOOKING_TIMELINE_EVENTS.APPROVED,
      `Booking approved for ${booking.resource.name}`,
      approverId,
      { comments }
    )

    // Step 5: Emit domain event
    DomainEventService.emit('BOOKING_APPROVED', {
      aggregateId: bookingId,
      userId: approverId,
      data: {
        bookingId,
        resourceName: booking.resource.name,
        employeeName: booking.employee.name,
        employeeId: booking.employeeId,
        approvedAt: new Date(),
        comments
      }
    })

    // Step 6: Notify employee
    await NotificationService.createNotification({
      type: 'BOOKING',
      message: `Your booking for ${booking.resource.name} has been approved`,
      userId: booking.employeeId
    })

    return updated
  }

  /**
   * Reject pending booking
   * @param {string} bookingId - Booking ID
   * @param {string} rejectorId - Rejector user ID
   * @param {string} reason - Rejection reason
   * @returns {Promise<Object>} - Updated booking
   * @throws {ValidationError, NotFoundError}
   */
  async rejectBooking(bookingId, rejectorId, reason) {
    // Step 1: Get booking
    const booking = await prisma.resourceBooking.findUnique({
      where: { id: bookingId },
      include: {
        resource: true,
        employee: true
      }
    })

    if (!booking) {
      throw new NotFoundError(`Booking ${bookingId} not found`)
    }

    if (booking.status !== 'PENDING') {
      throw new ValidationError(`Cannot reject booking with status ${booking.status}`)
    }

    // Step 2: Soft delete booking (set cancelledAt to mark as rejected)
    const updated = await prisma.resourceBooking.update({
      where: { id: bookingId },
      data: {
        status: 'REJECTED',
        cancelledBy: rejectorId,
        cancelledAt: new Date(),
        cancellationReason: reason
      },
      include: {
        resource: true,
        employee: true
      }
    })

    // Step 3: Create timeline event
    await BookingTimelineService.createEvent(
      bookingId,
      BOOKING_TIMELINE_EVENTS.REJECTED,
      `Booking rejected: ${reason}`,
      rejectorId,
      { reason }
    )

    // Step 4: Emit domain event
    DomainEventService.emit('BOOKING_REJECTED', {
      aggregateId: bookingId,
      userId: rejectorId,
      data: {
        bookingId,
        resourceName: booking.resource.name,
        employeeName: booking.employee.name,
        reason,
        rejectedAt: new Date()
      }
    })

    // Step 5: Notify employee
    await NotificationService.createNotification({
      type: 'BOOKING',
      message: `Your booking for ${booking.resource.name} has been rejected. Reason: ${reason}`,
      userId: booking.employeeId
    })

    return updated
  }

  /**
   * Cancel confirmed booking
   * @param {string} bookingId - Booking ID
   * @param {string} userId - User cancelling booking
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} - Updated booking
   * @throws {ValidationError, NotFoundError}
   */
  async cancelBooking(bookingId, userId, reason) {
    // Step 1: Get booking
    const booking = await prisma.resourceBooking.findUnique({
      where: { id: bookingId },
      include: {
        resource: true,
        employee: true
      }
    })

    if (!booking) {
      throw new NotFoundError(`Booking ${bookingId} not found`)
    }

    if (!['CONFIRMED', 'PENDING'].includes(booking.status)) {
      throw new ValidationError(`Cannot cancel booking with status ${booking.status}`)
    }

    // Step 2: Check if booking is in future
    if (booking.startTime <= new Date()) {
      throw new ValidationError('Cannot cancel booking that has already started')
    }

    // Step 3: Update booking status
    const updated = await prisma.resourceBooking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        cancelledBy: userId,
        cancelledAt: new Date(),
        cancellationReason: reason
      },
      include: {
        resource: true,
        employee: true
      }
    })

    // Step 4: Create timeline event
    await BookingTimelineService.createEvent(
      bookingId,
      BOOKING_TIMELINE_EVENTS.CANCELLED,
      `Booking cancelled: ${reason}`,
      userId,
      { reason }
    )

    // Step 5: Emit domain event
    DomainEventService.emit('BOOKING_CANCELLED', {
      aggregateId: bookingId,
      userId,
      data: {
        bookingId,
        resourceName: booking.resource.name,
        employeeName: booking.employee.name,
        reason,
        cancelledAt: new Date()
      }
    })

    // Step 6: Notify relevant parties
    await NotificationService.createNotification({
      type: 'BOOKING',
      message: `Booking for ${booking.resource.name} has been cancelled`,
      userId: booking.employeeId
    })

    return updated
  }

  /**
   * Modify booking times (for non-confirmed bookings or future modifications)
   * @param {string} bookingId - Booking ID
   * @param {Date} newStartTime - New start time (optional)
   * @param {Date} newEndTime - New end time (optional)
   * @param {string} userId - User modifying booking
   * @returns {Promise<Object>} - Updated booking
   * @throws {ValidationError, ConflictError, NotFoundError}
   */
  async modifyBooking(bookingId, newStartTime, newEndTime, userId) {
    // Step 1: Get booking
    const booking = await prisma.resourceBooking.findUnique({
      where: { id: bookingId },
      include: {
        resource: true,
        employee: true
      }
    })

    if (!booking) {
      throw new NotFoundError(`Booking ${bookingId} not found`)
    }

    // Allow modification only for pending bookings or future confirmed bookings
    if (booking.status === 'CANCELLED' || booking.status === 'REJECTED' || booking.status === 'COMPLETED') {
      throw new ValidationError(`Cannot modify booking with status ${booking.status}`)
    }

    // Step 2: Validate new times
    const startTime = newStartTime ? new Date(newStartTime) : booking.startTime
    const endTime = newEndTime ? new Date(newEndTime) : booking.endTime

    if (startTime >= endTime) {
      throw new ValidationError('startTime must be before endTime')
    }

    if (startTime < new Date()) {
      throw new ValidationError('Cannot modify to past time')
    }

    // Step 3: Check availability for new time slot
    const isAvailable = await AvailabilityService.isAvailable(
      booking.resourceId,
      startTime,
      endTime,
      bookingId
    )

    if (!isAvailable) {
      throw new ConflictError('New time slot is unavailable - booking conflict detected')
    }

    // Step 4: Update booking
    const updated = await prisma.resourceBooking.update({
      where: { id: bookingId },
      data: {
        startTime,
        endTime
      },
      include: {
        resource: true,
        employee: true
      }
    })

    // Step 5: Create timeline event
    await BookingTimelineService.createEvent(
      bookingId,
      BOOKING_TIMELINE_EVENTS.MODIFIED,
      `Booking modified from ${booking.startTime} - ${booking.endTime} to ${startTime} - ${endTime}`,
      userId,
      {
        originalStart: booking.startTime,
        originalEnd: booking.endTime,
        newStart: startTime,
        newEnd: endTime
      }
    )

    // Step 6: Emit domain event
    DomainEventService.emit('BOOKING_MODIFIED', {
      aggregateId: bookingId,
      userId,
      data: {
        bookingId,
        resourceName: booking.resource.name,
        previousStartTime: booking.startTime,
        previousEndTime: booking.endTime,
        newStartTime: startTime,
        newEndTime: endTime
      }
    })

    return updated
  }

  /**
   * Complete booking (called when booking time passes)
   * @param {string} bookingId - Booking ID
   * @returns {Promise<Object>} - Updated booking
   * @throws {NotFoundError}
   */
  async completeBooking(bookingId) {
    const booking = await prisma.resourceBooking.findUnique({
      where: { id: bookingId }
    })

    if (!booking) {
      throw new NotFoundError(`Booking ${bookingId} not found`)
    }

    if (booking.status !== 'CONFIRMED') {
      return booking
    }

    const updated = await prisma.resourceBooking.update({
      where: { id: bookingId },
      data: { status: 'COMPLETED' },
      include: {
        resource: true,
        employee: true
      }
    })

    // Create timeline event
    await BookingTimelineService.createEvent(
      bookingId,
      BOOKING_TIMELINE_EVENTS.COMPLETED,
      `Booking completed`,
      'system'
    )

    // Emit domain event
    DomainEventService.emit('BOOKING_COMPLETED', {
      aggregateId: bookingId,
      userId: 'system',
      data: { bookingId }
    })

    return updated
  }

  /**
   * Get all bookings with filters and pagination
   * @param {Object} filters - Filter options
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Array>}
   */
  async getAllBookings(filters = {}, pagination = {}) {
    const { skip = 0, take = 20 } = pagination

    return BookingRepository.findMany({
      ...filters,
      deletedAt: null
    }, {
      skip,
      take,
      include: {
        resource: true,
        employee: { include: { department: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  /**
   * Get employee's bookings
   * @param {string} employeeId - Employee ID
   * @param {Object} filters - Filter options
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Array>}
   */
  async getEmployeeBookings(employeeId, filters = {}, pagination = {}) {
    const { skip = 0, take = 20 } = pagination

    return BookingRepository.findMany({
      employeeId,
      deletedAt: null,
      ...filters
    }, {
      skip,
      take,
      include: {
        resource: true
      },
      orderBy: { startTime: 'asc' }
    })
  }

  /**
   * Get upcoming bookings for employee
   * @param {string} employeeId - Employee ID
   * @param {number} hoursAhead - Look ahead hours (default: 24)
   * @returns {Promise<Array>}
   */
  async getUpcomingBookings(employeeId, hoursAhead = 24) {
    const now = new Date()
    const future = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000)

    return BookingRepository.findMany({
      employeeId,
      status: 'CONFIRMED',
      deletedAt: null,
      startTime: { gte: now, lte: future }
    }, {
      include: { resource: true },
      orderBy: { startTime: 'asc' }
    })
  }

  /**
   * Get pending approvals
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>}
   */
  async getPendingApprovals(filters = {}) {
    return BookingRepository.findMany({
      status: 'PENDING',
      deletedAt: null,
      ...filters
    }, {
      include: {
        resource: true,
        employee: { include: { department: true } }
      },
      orderBy: { createdAt: 'asc' }
    })
  }

  /**
   * Get single booking by ID
   * @param {string} bookingId - Booking ID
   * @returns {Promise<Object|null>}
   */
  async getBookingById(bookingId) {
    return BookingRepository.findUnique({
      where: { id: bookingId },
      include: {
        resource: true,
        employee: { include: { department: true } }
      }
    })
  }

  /**
   * Count bookings by status
   * @returns {Promise<Object>}
   */
  async getBookingStatistics() {
    return prisma.resourceBooking.groupBy({
      by: ['status'],
      _count: true,
      where: { deletedAt: null }
    })
  }
}

export default new BookingService()
