/**
 * Pagination helper for Mongoose queries.
 * @param {import('mongoose').Model} model - Mongoose model to query.
 * @param {Object} filter - Database filter criteria.
 * @param {Object} options - Pagination options.
 * @param {number} [options.page=1] - Current page number.
 * @param {number} [options.limit=10] - Number of records per page.
 * @param {Object|string} [options.sort] - Query sort criteria.
 * @param {Object|string} [options.select] - Fields selection projection.
 * @param {string|Array} [options.populate] - Populate relations.
 * @returns {Promise<{ docs: Array, total: number, limit: number, page: number, pages: number }>}
 */
export async function paginate(model, filter = {}, options = {}) {
  const page = Math.max(1, parseInt(options.page || 1, 10))
  const limit = Math.max(1, parseInt(options.limit || 10, 10))
  const skip = (page - 1) * limit

  // Create clone of query to handle includes
  const query = model.find(filter)

  if (options.sort) {
    query.sort(options.sort)
  }
  if (options.select) {
    query.select(options.select)
  }
  if (options.populate) {
    query.populate(options.populate)
  }

  query.skip(skip).limit(limit)

  // Run document query and count concurrently
  const [docs, total] = await Promise.all([
    query.exec(),
    model.countDocuments(filter)
  ])

  const pages = Math.ceil(total / limit)

  return {
    docs,
    total,
    limit,
    page,
    pages,
  }
}

export default paginate
