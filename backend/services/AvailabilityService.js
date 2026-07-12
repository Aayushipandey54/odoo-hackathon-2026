/**
 * Availability Service
 * Checks resource availability and calculates free slots
 * Validates booking times against existing reservations
 */

import { prisma } from '../core/connection.js'
import { ValidationError } from '../utils/errors.js'

export class AvailabilityService {
  /**
   * Check if resource is available for given time range
   * Returns true if available, false if conflict exists
   * @param {string} resourceId - Resource ID
   * @param {Date} startTime - Start of requested slot
   * @param {Date} endTime - End of requested slot
   * @param {string} excludeBookingId - Booking ID to exclude (for modifications)
   * @returns {Promise<boolean>} - True if available
   * @throws {ValidationError} - If times invalid
   */
  async isAvailable(resourceId, startTime, endTime, excludeBookingId = null) {
    if (!resourceId) {
      throw new ValidationError('resourceId is required')
    }

    this.validateTimeRange(startTime, endTime)

    const query = {
      resourceId,
      status: { in: ['CONFIRMED', 'PENDING'] },
      deletedAt: null,
      OR: [
        {
          startTime: { lt: new Date(endTime) },
          endTime: { gt: new Date(startTime) }
        }
      ]
    }

    if (excludeBookingId) {
      query.id = { not: excludeBookingId }
    }

    const conflicts = await prisma.resourceBooking.count({ where: query })
    return conflicts === 0
  }

  /**
   * Get all overlapping bookings for a time range
   * @param {string} resourceId - Resource ID
   * @param {Date} startTime - Start time
   * @param {Date} endTime - End time
   * @returns {Promise<Array>} - Array of conflicting bookings
   */
  async getConflictingBookings(resourceId, startTime, endTime) {
    this.validateTimeRange(startTime, endTime)

    return prisma.resourceBooking.findMany({
      where: {
        resourceId,
        status: { in: ['CONFIRMED', 'PENDING'] },
        deletedAt: null,
        OR: [
          {
            startTime: { lt: new Date(endTime) },
            endTime: { gt: new Date(startTime) }
          }
        ]
      },
      include: {
        employee: {
          select: { id: true, name: true }
        }
      },
      orderBy: { startTime: 'asc' }
    })
  }

  /**
   * Get resource calendar for date range
   * Returns all bookings and free slots
   * @param {string} resourceId - Resource ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Object>} - Calendar data with bookings
   */
  async getResourceCalendar(resourceId, startDate, endDate) {
    this.validateDateRange(startDate, endDate)

    const bookings = await prisma.resourceBooking.findMany({
      where: {
        resourceId,
        status: { in: ['CONFIRMED', 'PENDING'] },
        deletedAt: null,
        startTime: { gte: new Date(startDate) },
        endTime: { lte: new Date(endDate) }
      },
      include: {
        employee: {
          select: { id: true, name: true, department: { select: { name: true } } }
        }
      },
      orderBy: { startTime: 'asc' }
    })

    return {
      resourceId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      bookings: bookings.map(b => ({
        id: b.id,
        employeeName: b.employee.name,
        employeeId: b.employee.id,
        department: b.employee.department?.name,
        purpose: b.purpose,
        startTime: b.startTime,
        endTime: b.endTime,
        status: b.status,
        duration: this.calculateDuration(b.startTime, b.endTime)
      })),
      totalBookings: bookings.length
    }
  }

  /**
   * Get available time slots for a resource on a specific date
   * @param {string} resourceId - Resource ID
   * @param {Date} date - Date to check
   * @param {number} slotDuration - Duration of each slot in minutes (default: 30)
   * @param {string} startHour - Start hour (default: '09:00')
   * @param {string} endHour - End hour (default: '17:00')
   * @returns {Promise<Array>} - Array of available slots
   */
  async getAvailableSlots(
    resourceId,
    date,
    slotDuration = 30,
    startHour = '09:00',
    endHour = '17:00'
  ) {
    if (!resourceId) {
      throw new ValidationError('resourceId is required')
    }

    if (!date) {
      throw new ValidationError('date is required')
    }

    if (slotDuration < 15 || slotDuration > 480) {
      throw new ValidationError('slotDuration must be between 15 and 480 minutes')
    }

    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)

    // Parse hours
    const startHourParts = startHour.split(':')
    const endHourParts = endHour.split(':')

    if (startHourParts.length !== 2 || endHourParts.length !== 2) {
      throw new ValidationError('startHour and endHour must be in HH:mm format')
    }

    const startHourNum = parseInt(startHourParts[0], 10)
    const startMinNum = parseInt(startHourParts[1], 10)
    const endHourNum = parseInt(endHourParts[0], 10)
    const endMinNum = parseInt(endHourParts[1], 10)

    if (isNaN(startHourNum) || isNaN(startMinNum) || isNaN(endHourNum) || isNaN(endMinNum)) {
      throw new ValidationError('Hour and minute values must be valid numbers')
    }

    if (startHourNum < 0 || startHourNum > 23 || endHourNum < 0 || endHourNum > 23) {
      throw new ValidationError('Hour must be between 0 and 23')
    }

    if (startMinNum < 0 || startMinNum > 59 || endMinNum < 0 || endMinNum > 59) {
      throw new ValidationError('Minute must be between 0 and 59')
    }

    const dayStart = new Date(targetDate)
    dayStart.setHours(startHourNum, startMinNum, 0, 0)

    const dayEnd = new Date(targetDate)
    dayEnd.setHours(endHourNum, endMinNum, 0, 0)

    // Ensure day end is after day start
    if (dayStart >= dayEnd) {
      throw new ValidationError('startHour must be before endHour')
    }

    // Prevent querying too far in future
    const maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() + 1)
    if (targetDate > maxDate) {
      throw new ValidationError('Cannot query dates more than 1 year in the future')
    }

    // Get all bookings for this day
    const bookings = await prisma.resourceBooking.findMany({
      where: {
        resourceId,
        status: { in: ['CONFIRMED', 'PENDING'] },
        deletedAt: null,
        startTime: { gte: dayStart },
        endTime: { lte: dayEnd }
      },
      orderBy: { startTime: 'asc' }
    })

    // Generate slots
    const slots = []
    let currentTime = new Date(dayStart)

    while (currentTime < dayEnd) {
      const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000)

      // Don't create slots that extend past day end
      if (slotEnd > dayEnd) {
        break
      }

      // Check if this slot overlaps with any booking
      const hasConflict = bookings.some(
        b => currentTime < b.endTime && slotEnd > b.startTime
      )

      if (!hasConflict) {
        slots.push({
          startTime: new Date(currentTime),
          endTime: new Date(slotEnd),
          duration: slotDuration,
          available: true
        })
      }

      currentTime = slotEnd
    }

    return slots
  }

  /**
   * Get resource utilization statistics
   * @param {string} resourceId - Resource ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Object>} - Utilization stats
   */
  async getResourceUtilization(resourceId, startDate, endDate) {
    this.validateDateRange(startDate, endDate)

    const bookings = await prisma.resourceBooking.findMany({
      where: {
        resourceId,
        status: 'CONFIRMED',
        deletedAt: null,
        startTime: { gte: new Date(startDate) },
        endTime: { lte: new Date(endDate) }
      }
    })

    const totalMinutes = this.calculateMinutesBetween(startDate, endDate)
    let bookedMinutes = 0

    bookings.forEach(b => {
      bookedMinutes += this.calculateMinutesBetween(b.startTime, b.endTime)
    })

    const utilizationRate = totalMinutes > 0 ? (bookedMinutes / totalMinutes) * 100 : 0

    return {
      resourceId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalBookings: bookings.length,
      bookedMinutes,
      totalMinutes,
      utilizationRate: Math.round(utilizationRate * 100) / 100,
      averageBookingDuration: bookings.length > 0 ? bookedMinutes / bookings.length : 0
    }
  }

  /**
   * Get next available slot for a resource
   * @param {string} resourceId - Resource ID
   * @param {Date} fromDate - Search from this date onwards
   * @param {number} minDuration - Minimum duration needed in minutes
   * @returns {Promise<Object|null>} - Next available slot or null
   */
  async getNextAvailableSlot(resourceId, fromDate, minDuration = 60) {
    const searchDate = new Date(fromDate)
    searchDate.setHours(0, 0, 0, 0)

    // Search next 30 days
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(searchDate)
      currentDate.setDate(currentDate.getDate() + i)

      const slots = await this.getAvailableSlots(resourceId, currentDate, minDuration)

      // Find first slot with enough duration
      const availableSlot = slots.find(
        s => this.calculateMinutesBetween(s.startTime, s.endTime) >= minDuration
      )

      if (availableSlot) {
        return availableSlot
      }
    }

    return null
  }

  /**
   * Validate time range for booking
   * @param {Date} startTime - Start time
   * @param {Date} endTime - End time
   * @throws {ValidationError}
   */
  validateTimeRange(startTime, endTime) {
    const start = new Date(startTime)
    const end = new Date(endTime)

    if (isNaN(start.getTime())) {
      throw new ValidationError('Invalid startTime format')
    }

    if (isNaN(end.getTime())) {
      throw new ValidationError('Invalid endTime format')
    }

    if (start >= end) {
      throw new ValidationError('startTime must be before endTime')
    }

    if (start < new Date()) {
      throw new ValidationError('Cannot book in the past')
    }

    // Max booking duration: 7 days
    const maxDuration = 7 * 24 * 60 * 60 * 1000
    if (end.getTime() - start.getTime() > maxDuration) {
      throw new ValidationError('Booking cannot exceed 7 days')
    }
  }

  /**
   * Validate date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @throws {ValidationError}
   */
  validateDateRange(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime())) {
      throw new ValidationError('Invalid startDate format')
    }

    if (isNaN(end.getTime())) {
      throw new ValidationError('Invalid endDate format')
    }

    if (start > end) {
      throw new ValidationError('startDate must be before or equal to endDate')
    }

    // Prevent querying too far in past
    const minDate = new Date()
    minDate.setFullYear(minDate.getFullYear() - 1)
    if (start < minDate) {
      throw new ValidationError('Date range cannot query more than 1 year in the past')
    }

    // Max range: 90 days
    const maxRange = 90 * 24 * 60 * 60 * 1000
    if (end.getTime() - start.getTime() > maxRange) {
      throw new ValidationError('Date range cannot exceed 90 days')
    }
  }

  /**
   * Calculate duration in minutes between two dates
   * @private
   */
  calculateMinutesBetween(startTime, endTime) {
    return Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000)
  }

  /**
   * Calculate duration string (e.g., "2h 30m")
   * @private
   */
  calculateDuration(startTime, endTime) {
    const minutes = this.calculateMinutesBetween(startTime, endTime)
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }
}

export default new AvailabilityService()
