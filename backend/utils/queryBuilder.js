/**
 * Utility to process query strings, parse filters, sorting, search keys and projection mappings for Prisma.
 */

/**
 * Builds Prisma filters (where) and pagination options from raw query parameters.
 * Supports equals, contains, startsWith, endsWith, in, date range, numeric range, boolean.
 * 
 * @param {Object} queryParams - The request query parameters (e.g. req.query).
 * @param {Array<string>} searchFields - Fields to perform text search on.
 * @returns {{ where: Object, options: Object }}
 */
export function buildQuery(queryParams = {}, searchFields = []) {
  const { page, limit, sort, search, select, include, ...filters } = queryParams

  const where = {}

  // Parse filters
  Object.keys(filters).forEach(key => {
    let val = filters[key]
    
    // Convert string booleans
    if (val === 'true') val = true
    if (val === 'false') val = false
    
    if (val !== undefined && val !== null && val !== '') {
      
      // Handle comparative operators: price[gte]=100
      if (typeof val === 'object' && !Array.isArray(val)) {
        const nestedFilter = {}
        Object.keys(val).forEach(op => {
          // op could be gte, lte, gt, lt, equals, contains
          let parsedVal = val[op]
          
          // Date auto-parse logic
          if (typeof parsedVal === 'string' && !isNaN(Date.parse(parsedVal)) && parsedVal.includes('-')) {
            parsedVal = new Date(parsedVal)
          } else if (!isNaN(parsedVal)) {
            parsedVal = Number(parsedVal)
          }
          
          nestedFilter[op] = parsedVal
        })
        where[key] = nestedFilter
      } else if (Array.isArray(val)) {
        // Handle IN array filters: status[]=active&status[]=pending
        where[key] = { in: val }
      } else {
        // Direct match with string/number/boolean conversions
        let parsedVal = val
        if (typeof val === 'string' && !isNaN(val)) parsedVal = Number(val)
        where[key] = { equals: parsedVal }
      }
    }
  })

  // Parse keyword search across designated fields
  if (search && searchFields.length > 0) {
    where.OR = searchFields.map(field => ({
      [field]: { contains: search, mode: 'insensitive' },
    }))
  }

  // Parse projection (select)
  let selectFields = undefined
  if (typeof select === 'string' && select.trim() !== '') {
    selectFields = {}
    select.split(',').forEach(field => {
      selectFields[field.trim()] = true
    })
  }

  // Parse include relations
  let includeFields = undefined
  if (typeof include === 'string' && include.trim() !== '') {
    includeFields = {}
    include.split(',').forEach(field => {
      includeFields[field.trim()] = true
    })
  }

  // Parse sorting
  let orderBy = undefined
  if (typeof sort === 'string' && sort.trim() !== '') {
    orderBy = {}
    sort.split(',').forEach(s => {
      const field = s.trim()
      if (field.startsWith('-')) {
        orderBy[field.substring(1)] = 'desc'
      } else {
        orderBy[field] = 'asc'
      }
    })
  } else {
    // Default sort
    orderBy = { createdAt: 'desc' }
  }

  const options = {
    page: page ? parseInt(page, 10) : undefined,
    limit: limit ? parseInt(limit, 10) : undefined,
    orderBy,
    select: selectFields,
    include: includeFields
  }

  return { where, options }
}

export default buildQuery
