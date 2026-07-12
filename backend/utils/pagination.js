/**
 * Pagination helper for Prisma models.
 * @param {Object} model - Prisma model delegate (e.g. prisma.asset).
 * @param {Object} where - Database filter criteria.
 * @param {Object} options - Pagination and sorting options.
 * @param {number} [options.page=1] - Current page number.
 * @param {number} [options.limit=10] - Number of records per page.
 * @param {Object} [options.orderBy] - Query sort criteria.
 * @param {Object} [options.select] - Fields selection projection.
 * @param {Object} [options.include] - Populate relations.
 * @returns {Promise<Object>}
 */
export async function paginate(model, where = {}, options = {}) {
  const page = Math.max(1, parseInt(options.page || 1, 10))
  const limit = Math.max(1, parseInt(options.limit || 10, 10))
  const skip = (page - 1) * limit

  const queryArgs = {
    where,
    take: limit,
    skip,
  }

  if (options.orderBy) queryArgs.orderBy = options.orderBy
  if (options.select) queryArgs.select = options.select
  if (options.include) queryArgs.include = options.include

  const [docs, total] = await Promise.all([
    model.findMany(queryArgs),
    model.count({ where })
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

export default paginate
