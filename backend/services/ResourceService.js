/**
 * Resource Service
 * Manages shared resource lifecycle
 * Handles CRUD, filtering, activation, statistics
 */

import ResourceRepository from '../repositories/ResourceRepository.js'
import { prisma } from '../core/connection.js'
import { NotFoundError, ValidationError } from '../utils/errors.js'

export class ResourceService {
  /**
   * Get all resources with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>}
   */
  async getAll(filters = {}) {
    return ResourceRepository.findMany(filters, {
      include: { department: true }
    })
  }

  /**
   * Get active resources
   * @param {Object} filters - Additional filter options
   * @returns {Promise<Array>}
   */
  async getActiveResources(filters = {}) {
    return ResourceRepository.findMany({
      isActive: true,
      ...filters
    }, {
      include: { department: true },
      orderBy: { name: 'asc' }
    })
  }

  /**
   * Get resources by type
   * @param {string} type - Resource type
   * @returns {Promise<Array>}
   */
  async getResourcesByType(type) {
    return ResourceRepository.findMany({
      type,
      isActive: true
    }, {
      include: { department: true },
      orderBy: { name: 'asc' }
    })
  }

  /**
   * Get resources by department
   * @param {string} departmentId - Department ID
   * @returns {Promise<Array>}
   */
  async getResourcesByDepartment(departmentId) {
    return ResourceRepository.findMany({
      departmentId,
      isActive: true
    }, {
      include: { department: true },
      orderBy: { name: 'asc' }
    })
  }

  /**
   * Create new resource
   * @param {Object} data - Resource data
   * @returns {Promise<Object>} - Created resource
   */
  async create(data) {
    // Verify department exists if provided
    if (data.departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: data.departmentId }
      })

      if (!department) {
        throw new NotFoundError(`Department ${data.departmentId} not found`)
      }
    }

    return ResourceRepository.create({
      ...data,
      isActive: true,
      capacity: data.capacity || 1,
      requiresApproval: data.requiresApproval || false
    })
  }

  /**
   * Get resource by ID
   * @param {string} id - Resource ID
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    return ResourceRepository.findById(id)
  }

  /**
   * Get resource with full details including bookings
   * @param {string} id - Resource ID
   * @param {Date} startDate - Start date for bookings
   * @param {Date} endDate - End date for bookings
   * @returns {Promise<Object>}
   */
  async getResourceWithBookings(id, startDate, endDate) {
    const resource = await prisma.resource.findUnique({
      where: { id },
      include: {
        department: true,
        bookings: {
          where: {
            status: { in: ['CONFIRMED', 'PENDING'] },
            startTime: { gte: new Date(startDate) },
            endTime: { lte: new Date(endDate) },
            deletedAt: null
          },
          include: {
            employee: { select: { id: true, name: true } }
          },
          orderBy: { startTime: 'asc' }
        }
      }
    })

    return resource
  }

  /**
   * Update resource
   * @param {string} id - Resource ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>} - Updated resource
   */
  async update(id, data) {
    // Verify resource exists
    const existing = await ResourceRepository.findById(id)
    if (!existing) {
      throw new NotFoundError(`Resource ${id} not found`)
    }

    // Verify department if being updated
    if (data.departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: data.departmentId }
      })

      if (!department) {
        throw new NotFoundError(`Department ${data.departmentId} not found`)
      }
    }

    return ResourceRepository.update(id, data)
  }

  /**
   * Toggle resource active status
   * @param {string} id - Resource ID
   * @param {boolean} isActive - New active status
   * @returns {Promise<Object>} - Updated resource
   */
  async toggleResourceStatus(id, isActive) {
    const resource = await ResourceRepository.findById(id)
    if (!resource) {
      throw new NotFoundError(`Resource ${id} not found`)
    }

    return ResourceRepository.update(id, { isActive })
  }

  /**
   * Delete resource (soft delete)
   * @param {string} id - Resource ID
   * @returns {Promise<Object>}
   */
  async delete(id) {
    return ResourceRepository.softDelete(id)
  }

  /**
   * Get resource statistics
   * @param {string} resourceId - Resource ID
   * @param {Date} startDate - Start date for statistics
   * @param {Date} endDate - End date for statistics
   * @returns {Promise<Object>} - Statistics
   */
  async getResourceStatistics(resourceId, startDate, endDate) {
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId }
    })

    if (!resource) {
      throw new NotFoundError(`Resource ${resourceId} not found`)
    }

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
      resourceName: resource.name,
      type: resource.type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalBookings: bookings.length,
      confirmedBookings: bookings.filter(b => b.status === 'CONFIRMED').length,
      bookedMinutes,
      totalMinutes,
      utilizationRate: Math.round(utilizationRate * 100) / 100,
      averageBookingDuration: bookings.length > 0 ? Math.round(bookedMinutes / bookings.length * 100) / 100 : 0
    }
  }

  /**
   * Get statistics for all resources
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>}
   */
  async getAllResourcesStatistics(filters = {}) {
    const resources = await this.getAll(filters)

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const stats = await Promise.all(
      resources.map(r => this.getResourceStatistics(r.id, thirtyDaysAgo, now))
    )

    return stats
  }

  /**
   * Search resources
   * @param {string} query - Search query
   * @returns {Promise<Array>}
   */
  async searchResources(query) {
    if (!query || query.trim().length === 0) {
      return []
    }

    const lowerQuery = query.toLowerCase()

    return prisma.resource.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        OR: [
          { name: { contains: lowerQuery, mode: 'insensitive' } },
          { type: { contains: lowerQuery, mode: 'insensitive' } },
          { description: { contains: lowerQuery, mode: 'insensitive' } }
        ]
      },
      include: { department: true },
      take: 50
    })
  }

  /**
   * Get resources requiring approval
   * @returns {Promise<Array>}
   */
  async getResourcesRequiringApproval() {
    return ResourceRepository.findMany({
      requiresApproval: true,
      isActive: true
    }, {
      include: { department: true }
    })
  }

  /**
   * Private helper: Calculate minutes between dates
   * @private
   */
  calculateMinutesBetween(startTime, endTime) {
    return Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000)
  }
}

export default new ResourceService()
