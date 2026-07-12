import { NotFoundError, DuplicateRecordError } from '../utils/errors.js'

/**
 * Generic Prisma Repository class.
 * Concrete models will extend this class tomorrow for rapid business actions.
 */
export class GenericRepository {
  /**
   * @param {Object} modelDelegate - The Prisma model delegate instance (e.g. prisma.item).
   */
  constructor(modelDelegate) {
    if (!modelDelegate) {
      throw new Error('Prisma Model Delegate is required to initialize Repository')
    }
    this.model = modelDelegate
  }

  /**
   * Create a new database record.
   * @param {Object} data
   * @returns {Promise<any>}
   */
  async create(data) {
    try {
      return await this.model.create({ data })
    } catch (err) {
      if (err.code === 'P2002') {
        throw new DuplicateRecordError(`Record violates unique constraint keys`)
      }
      throw err
    }
  }

  /**
   * Find record by ID.
   * @param {string} id
   * @returns {Promise<any>}
   */
  async findById(id) {
    try {
      const record = await this.model.findUnique({
        where: { id }
      })
      if (!record || record.deletedAt) {
        throw new NotFoundError(`Record not found for id "${id}"`)
      }
      return record
    } catch (err) {
      if (err instanceof NotFoundError) throw err
      throw err
    }
  }

  /**
   * Find a single record matching filter.
   * @param {Object} filter
   * @returns {Promise<any>}
   */
  async findOne(filter = {}) {
    const where = { ...filter, deletedAt: null }
    return this.model.findFirst({
      where
    })
  }

  /**
   * Find all records matching filter.
   * @param {Object} filter
   * @param {Object} [options]
   * @returns {Promise<Array>}
   */
  async findAll(filter = {}, options = {}) {
    const where = { ...filter }
    if (!options.includeDeleted) {
      where.deletedAt = null
    }

    const queryOptions = { where }
    if (options.orderBy) queryOptions.orderBy = options.orderBy
    if (options.select) queryOptions.select = options.select
    if (options.take) queryOptions.take = options.take
    if (options.skip) queryOptions.skip = options.skip

    return this.model.findMany(queryOptions)
  }

  /**
   * Update a record by ID.
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<any>}
   */
  async update(id, data) {
    try {
      return await this.model.update({
        where: { id },
        data
      })
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundError(`Record not found for id "${id}"`)
      }
      if (err.code === 'P2002') {
        throw new DuplicateRecordError(`Update failed: violates unique constraint keys`)
      }
      throw err
    }
  }

  /**
   * Hard delete a record by ID.
   * @param {string} id
   * @returns {Promise<any>}
   */
  async delete(id) {
    try {
      return await this.model.delete({
        where: { id }
      })
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundError(`Record not found for id "${id}"`)
      }
      throw err
    }
  }

  /**
   * Soft delete a record by ID.
   * @param {string} id
   * @returns {Promise<any>}
   */
  async softDelete(id) {
    try {
      return await this.model.update({
        where: { id },
        data: { deletedAt: new Date() }
      })
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundError(`Record not found for id "${id}"`)
      }
      throw err
    }
  }

  /**
   * Restore a soft-deleted record by ID.
   * @param {string} id
   * @returns {Promise<any>}
   */
  async restore(id) {
    try {
      return await this.model.update({
        where: { id },
        data: { deletedAt: null }
      })
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundError(`Record not found for id "${id}"`)
      }
      throw err
    }
  }

  /**
   * Check if any record matches filter.
   * @param {Object} filter
   * @returns {Promise<boolean>}
   */
  async exists(filter = {}) {
    const count = await this.model.count({
      where: { ...filter, deletedAt: null }
    })
    return count > 0
  }

  /**
   * Count documents matching filter.
   * @param {Object} filter
   * @returns {Promise<number>}
   */
  async count(filter = {}) {
    return this.model.count({
      where: { ...filter, deletedAt: null }
    })
  }

  /**
   * Paginate documents.
   * @param {Object} filter
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  async paginate(filter = {}, options = {}) {
    const page = Math.max(1, parseInt(options.page || 1, 10))
    const limit = Math.max(1, parseInt(options.limit || 10, 10))
    const skip = (page - 1) * limit
    const where = { ...filter, deletedAt: null }

    const [total, docs] = await Promise.all([
      this.model.count({ where }),
      this.model.findMany({
        where,
        take: limit,
        skip,
        orderBy: options.orderBy
      })
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      docs,
      total,
      limit,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    }
  }
}

export default GenericRepository
