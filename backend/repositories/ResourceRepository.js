import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class ResourceRepository extends GenericRepository {
  constructor() {
    super(prisma.resource)
  }

  /**
   * Find active resources
   */
  async findActiveResources(filters = {}) {
    return this.model.findMany({
      where: { isActive: true, deletedAt: null, ...filters },
      include: { department: true },
      orderBy: { name: 'asc' }
    })
  }

  /**
   * Find resources by department
   */
  async findByDepartment(departmentId) {
    return this.model.findMany({
      where: { departmentId, isActive: true },
      orderBy: { name: 'asc' }
    })
  }

  /**
   * Find resources by type
   */
  async findByType(type) {
    return this.model.findMany({
      where: { type, isActive: true },
      include: { department: true },
      orderBy: { name: 'asc' }
    })
  }

  /**
   * Get resource with bookings in date range
   */
  async getResourceWithBookings(resourceId, startDate, endDate) {
    return this.model.findUnique({
      where: { id: resourceId },
      include: {
        department: true,
        bookings: {
          where: {
            status: { in: ['CONFIRMED', 'PENDING'] },
            startTime: { gte: new Date(startDate) },
            endTime: { lte: new Date(endDate) },
            deletedAt: null
          },
          include: { employee: { select: { id: true, name: true } } },
          orderBy: { startTime: 'asc' }
        }
      }
    })
  }

  /**
   * Find resources requiring approval
   */
  async findResourcesRequiringApproval() {
    return this.model.findMany({
      where: { requiresApproval: true, isActive: true },
      include: { department: true }
    })
  }

  /**
   * Search resources
   */
  async search(query) {
    const lowerQuery = query.toLowerCase()

    return this.model.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { type: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: { department: true },
      take: 50
    })
  }
}

export default new ResourceRepository()
