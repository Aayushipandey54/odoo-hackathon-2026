/**
 * Utility to process query strings, parse filters, sorting, search keys and projection mappings.
 */

/**
 * Builds MongoDB filters and pagination options from raw query parameters.
 * @param {Object} queryParams - The request query parameters (e.g. req.query).
 * @param {Array<string>} searchFields - Fields to perform text search on.
 * @returns {{ filter: Object, options: Object }}
 */
export function buildQuery(queryParams = {}, searchFields = []) {
  const { page, limit, sort, search, select, populate, ...filters } = queryParams

  const filter = {}

  // Parse filters (e.g. status=active, age=25)
  Object.keys(filters).forEach(key => {
    const val = filters[key]
    if (val !== undefined && val !== null && val !== '') {
      // Handle comparative operators: price[gte]=100 -> { price: { $gte: 100 } }
      if (typeof val === 'object') {
        const nestedFilter = {}
        Object.keys(val).forEach(op => {
          const operator = op.startsWith('$') ? op : `$${op}`
          nestedFilter[operator] = isNaN(val[op]) ? val[op] : Number(val[op])
        })
        filter[key] = nestedFilter
      } else {
        // Direct match with string/number conversions
        filter[key] = isNaN(val) ? val : Number(val)
      }
    }
  })

  // Parse keyword search across designated fields
  if (search && searchFields.length > 0) {
    filter.$or = searchFields.map(field => ({
      [field]: { $regex: search, $options: 'i' },
    }))
  }

  // Parse projection (e.g., select=name,email -> 'name email')
  let selectFields = select
  if (typeof select === 'string') {
    selectFields = select.split(',').join(' ')
  }

  const options = {
    page: page ? parseInt(page, 10) : undefined,
    limit: limit ? parseInt(limit, 10) : undefined,
    sort,
    select: selectFields,
    populate,
  }

  return { filter, options }
}

export default buildQuery
