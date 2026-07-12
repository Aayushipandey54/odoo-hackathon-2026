import { z } from 'zod'

/**
 * Asset Validation Schemas
 * All asset-related request validation using Zod
 */

// ===== CREATE ASSET SCHEMA =====
export const createAssetSchema = z.object({
  body: z.object({
    tag: z.string()
      .min(1, 'Asset tag is required')
      .max(50, 'Asset tag must be less than 50 characters'),
    
    name: z.string()
      .min(2, 'Asset name must be at least 2 characters')
      .max(200, 'Asset name must be less than 200 characters'),
    
    categoryId: z.string()
      .uuid('Invalid category ID'),
    
    departmentId: z.string()
      .uuid('Invalid department ID'),
    
    locationId: z.string()
      .uuid('Invalid location ID'),
    
    // Optional fields
    serialNumber: z.string()
      .max(100, 'Serial number must be less than 100 characters')
      .optional()
      .nullable(),
    
    manufacturer: z.string()
      .max(100, 'Manufacturer must be less than 100 characters')
      .optional()
      .nullable(),
    
    model: z.string()
      .max(100, 'Model must be less than 100 characters')
      .optional()
      .nullable(),
    
    description: z.string()
      .max(1000, 'Description must be less than 1000 characters')
      .optional()
      .nullable(),
    
    purchaseDate: z.string()
      .datetime()
      .optional()
      .nullable(),
    
    purchaseCost: z.number()
      .positive('Purchase cost must be a positive number')
      .optional()
      .nullable(),
    
    warrantyExpiry: z.string()
      .datetime()
      .optional()
      .nullable(),
    
    condition: z.enum(['NEW', 'GOOD', 'FAIR', 'DAMAGED'])
      .optional()
      .default('NEW')
  })
})

// ===== UPDATE ASSET SCHEMA =====
export const updateAssetSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid asset ID')
  }),
  body: z.object({
    tag: z.string()
      .min(1, 'Asset tag is required')
      .max(50, 'Asset tag must be less than 50 characters')
      .optional(),
    
    name: z.string()
      .min(2, 'Asset name must be at least 2 characters')
      .max(200, 'Asset name must be less than 200 characters')
      .optional(),
    
    serialNumber: z.string()
      .max(100, 'Serial number must be less than 100 characters')
      .optional()
      .nullable(),
    
    manufacturer: z.string()
      .max(100, 'Manufacturer must be less than 100 characters')
      .optional()
      .nullable(),
    
    model: z.string()
      .max(100, 'Model must be less than 100 characters')
      .optional()
      .nullable(),
    
    description: z.string()
      .max(1000, 'Description must be less than 1000 characters')
      .optional()
      .nullable(),
    
    purchaseDate: z.string()
      .datetime()
      .optional()
      .nullable(),
    
    purchaseCost: z.number()
      .positive('Purchase cost must be a positive number')
      .optional()
      .nullable(),
    
    warrantyExpiry: z.string()
      .datetime()
      .optional()
      .nullable(),
    
    condition: z.enum(['NEW', 'GOOD', 'FAIR', 'DAMAGED'])
      .optional()
  }).strict()
})

// ===== DELETE ASSET SCHEMA =====
export const deleteAssetSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid asset ID')
  })
})

// ===== GET ASSET SCHEMA =====
export const getAssetSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid asset ID')
  })
})

// ===== SEARCH ASSET SCHEMA =====
export const searchAssetSchema = z.object({
  query: z.object({
    search: z.string()
      .max(100, 'Search query must be less than 100 characters')
      .optional(),
    
    categoryId: z.string().uuid().optional(),
    departmentId: z.string().uuid().optional(),
    locationId: z.string().uuid().optional(),
    
    status: z.enum(['AVAILABLE', 'ALLOCATED', 'MAINTENANCE', 'RETIRED', 'DISPOSED', 'RESERVED'])
      .optional(),
    
    condition: z.enum(['NEW', 'GOOD', 'FAIR', 'DAMAGED'])
      .optional(),
    
    purchaseDateStart: z.string().datetime().optional(),
    purchaseDateEnd: z.string().datetime().optional(),
    warrantyExpiryStart: z.string().datetime().optional(),
    warrantyExpiryEnd: z.string().datetime().optional(),
    
    sortBy: z.enum(['name', 'createdAt', 'purchaseDate', 'status', 'tag', 'assetNumber'])
      .optional()
      .default('createdAt'),
    
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    
    limit: z.string()
      .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0 && parseInt(val) <= 100,
        'Limit must be a number between 1 and 100')
      .transform(Number)
      .optional()
      .default('20'),
    
    offset: z.string()
      .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0,
        'Offset must be a non-negative number')
      .transform(Number)
      .optional()
      .default('0')
  })
})

// ===== UPLOAD IMAGE SCHEMA =====
export const uploadImageSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid asset ID')
  })
  // File validation happens in middleware
})

// ===== UPLOAD DOCUMENT SCHEMA =====
export const uploadDocumentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid asset ID')
  }),
  body: z.object({
    documentType: z.enum(['MANUAL', 'WARRANTY', 'INVOICE', 'OTHER'])
      .default('OTHER')
  })
  // File validation happens in middleware
})

// ===== DELETE IMAGE SCHEMA =====
export const deleteImageSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid asset ID'),
    imageId: z.string().uuid('Invalid image ID')
  })
})

// ===== DELETE DOCUMENT SCHEMA =====
export const deleteDocumentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid asset ID'),
    docId: z.string().uuid('Invalid document ID')
  })
})

// ===== GET QR CODE SCHEMA =====
export const getQRCodeSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid asset ID')
  })
})

// ===== REGENERATE QR CODE SCHEMA =====
export const regenerateQRCodeSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid asset ID')
  })
})

// ===== GET TIMELINE SCHEMA =====
export const getTimelineSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid asset ID')
  }),
  query: z.object({
    limit: z.string()
      .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0 && parseInt(val) <= 100,
        'Limit must be a number between 1 and 100')
      .transform(Number)
      .optional()
      .default('50'),
    
    offset: z.string()
      .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0,
        'Offset must be a non-negative number')
      .transform(Number)
      .optional()
      .default('0')
  })
})

/**
 * Validation middleware wrapper
 * Usage: validate(schema)(req, res, next)
 */
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      })

      req.validatedData = validated
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
        
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        })
      }

      next(error)
    }
  }
}
