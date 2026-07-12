import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '../ui/Button'
import { AlertCircle } from 'lucide-react'

/**
 * Asset Form Component
 * Handles asset creation and editing with comprehensive validation
 */

const assetSchema = z.object({
  name: z.string().min(2, 'Asset name must be at least 2 characters'),
  tag: z.string().min(1, 'Asset tag is required'),
  categoryId: z.string().min(1, 'Category is required'),
  departmentId: z.string().min(1, 'Department is required'),
  locationId: z.string().min(1, 'Location is required'),
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  description: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchaseCost: z.number().positive().optional().or(z.literal('')),
  warrantyExpiry: z.string().optional(),
  condition: z.enum(['NEW', 'GOOD', 'FAIR', 'DAMAGED']).optional()
})

export default function AssetForm({
  initialData = null,
  categories = [],
  departments = [],
  locations = [],
  onSubmit,
  isLoading = false
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(assetSchema),
    defaultValues: initialData || {
      condition: 'NEW'
    }
  })

  const handleFormSubmit = async (data) => {
    // Convert dates to ISO format (add time component if only date provided)
    if (data.purchaseDate) {
      data.purchaseDate = new Date(data.purchaseDate + 'T00:00:00Z').toISOString()
    }
    if (data.warrantyExpiry) {
      data.warrantyExpiry = new Date(data.warrantyExpiry + 'T00:00:00Z').toISOString()
    }

    // Convert purchaseCost to number if provided
    if (data.purchaseCost) {
      data.purchaseCost = parseFloat(data.purchaseCost)
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Asset Name *
            </label>
            <input
              {...register('name')}
              placeholder="Enter asset name"
              className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30 disabled:opacity-50"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {errors.name.message}
              </p>
            )}
          </div>

          {/* Tag */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Asset Tag *
            </label>
            <input
              {...register('tag')}
              placeholder="Enter unique tag"
              className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30 disabled:opacity-50"
              disabled={isLoading}
            />
            {errors.tag && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {errors.tag.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Category *
            </label>
            <select
              {...register('categoryId')}
              className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30 disabled:opacity-50"
              disabled={isLoading}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Department *
            </label>
            <select
              {...register('departmentId')}
              className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30 disabled:opacity-50"
              disabled={isLoading}
            >
              <option value="">Select department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.departmentId && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {errors.departmentId.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Location *
            </label>
            <select
              {...register('locationId')}
              className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30 disabled:opacity-50"
              disabled={isLoading}
            >
              <option value="">Select location</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
            {errors.locationId && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {errors.locationId.message}
              </p>
            )}
          </div>

          {/* Serial Number */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Serial Number
            </label>
            <input
              {...register('serialNumber')}
              placeholder="Enter serial number"
              className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30 disabled:opacity-50"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Manufacturer */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Manufacturer
            </label>
            <input
              {...register('manufacturer')}
              placeholder="Enter manufacturer"
              className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30 disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Model
            </label>
            <input
              {...register('model')}
              placeholder="Enter model"
              className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30 disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Condition
            </label>
            <select
              {...register('condition')}
              className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30 disabled:opacity-50"
              disabled={isLoading}
            >
              <option value="NEW">New</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="DAMAGED">Damaged</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              placeholder="Enter asset description"
              rows="3"
              className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30 disabled:opacity-50 resize-none"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Purchase & Warranty */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Purchase & Warranty</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Purchase Date */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Purchase Date
            </label>
            <input
              type="date"
              {...register('purchaseDate')}
              className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30 disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          {/* Purchase Cost */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Purchase Cost
            </label>
            <input
              type="number"
              step="0.01"
              {...register('purchaseCost')}
              placeholder="Enter purchase cost"
              className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30 disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          {/* Warranty Expiry */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Warranty Expiry Date
            </label>
            <input
              type="date"
              {...register('warrantyExpiry')}
              className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30 disabled:opacity-50"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-2 justify-end">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Asset' : 'Register Asset'}
        </Button>
      </div>
    </form>
  )
}
