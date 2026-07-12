import { z } from 'zod'

export const departmentSchema = z.object({
  name: z.string().min(2, 'Department name must be at least 2 characters'),
  headId: z.string().uuid('Invalid Head ID format').optional().nullable(),
  parentId: z.string().uuid('Invalid Parent ID format').optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional()
})
export const departmentUpdateSchema = departmentSchema.partial()

export const employeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  departmentId: z.string().uuid('Invalid Department ID format'),
  // Email and role are managed via auth, but included here for updates if necessary
})
export const employeeUpdateSchema = employeeSchema.partial()

export const locationSchema = z.object({
  name: z.string().min(2, 'Location name must be at least 2 characters'),
  address: z.string().optional().nullable()
})
export const locationUpdateSchema = locationSchema.partial()

export const assetCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters')
})
export const assetCategoryUpdateSchema = assetCategorySchema.partial()

export const organizationSettingsSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  currency: z.string().length(3, 'Currency must be a 3-letter ISO code'),
  timezone: z.string().min(2, 'Timezone is required')
})
export const organizationSettingsUpdateSchema = organizationSettingsSchema.partial()
