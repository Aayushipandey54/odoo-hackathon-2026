import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class BookingRepository extends GenericRepository {
  constructor() {
    super(prisma.resourceBooking)
  }

  /**
   * Find overlapping bookings
   */
  async findOverlappingBookings(resourceId, startTime, endTime, excludeId = null) {
    const where = {
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

    if (excludeId) {
      where.id = { not: excludeId }
    }

    return this.model.findMany({ where })
  }

  /**
   * Find bookings by employee
   */
  async findByEmployee(employeeId, filters = {}, options = {}) {
    const { skip = 0, take = 20 } = options

    return this.model.findMany({
      where: { employeeId, ...filters },
      skip,
      take,
      include: options.include || { resource: true }
    })
  }

  /**
   * Find bookings for resource in date range
   */
  async findByResource(resourceId, startDate, endDate, filters = {}) {
    return this.model.findMany({
      where: {
        resourceId,
        startTime: { gte: new Date(startDate) },
        endTime: { lte: new Date(endDate) },
        ...filters
      },
      include: {
        employee: { include: { department: true } }
      },
      orderBy: { startTime: 'asc' }
    })
  }

  /**
   * Find pending approvals
   */
  async findPendingApprovals(departmentId = null, filters = {}) {
    const where = {
      status: 'PENDING',
      deletedAt: null,
      ...filters
    }

    return this.model.findMany({
      where,
      include: {
        resource: true,
        employee: {
          include: {
            department: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })
  }

  /**
   * Find upcoming bookings
   */
  async findUpcomingBookings(employeeId, hoursAhead = 24) {
    const now = new Date()
    const future = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000)

    return this.model.findMany({
      where: {
        employeeId,
        status: 'CONFIRMED',
        deletedAt: null,
        startTime: { gte: now, lte: future }
      },
      include: { resource: true },
      orderBy: { startTime: 'asc' }
    })
  }

  /**
   * Count bookings by status
   */
  async countByStatus(status) {
    return this.model.count({
      where: { status, deletedAt: null }
    })
  }

  /**
   * Find bookings by date range
   */
  async findByDateRange(startDate, endDate, filters = {}) {
    return this.model.findMany({
      where: {
        startTime: { gte: new Date(startDate) },
        endTime: { lte: new Date(endDate) },
        deletedAt: null,
        ...filters
      },
      include: {
        resource: true,
        employee: true
      },
      orderBy: { startTime: 'asc' }
    })
  }
}

export default new BookingRepository()
