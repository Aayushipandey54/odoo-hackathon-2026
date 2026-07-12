import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import Button from '../ui/Button'

/**
 * Asset Filters Component
 * Advanced filtering panel for asset search
 */
export default function AssetFilters({
  onApplyFilters,
  categories = [],
  departments = [],
  locations = [],
  isLoading = false
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    condition: '',
    categoryId: '',
    departmentId: '',
    locationId: '',
    purchaseDateStart: '',
    purchaseDateEnd: '',
    warrantyExpiryStart: '',
    warrantyExpiryEnd: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleApply = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    )
    onApplyFilters(cleanFilters)
    setIsOpen(false)
  }

  const handleReset = () => {
    setFilters({
      status: '',
      condition: '',
      categoryId: '',
      departmentId: '',
      locationId: '',
      purchaseDateStart: '',
      purchaseDateEnd: '',
      warrantyExpiryStart: '',
      warrantyExpiryEnd: ''
    })
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <>
      {/* Filter Button */}
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={`gap-2 ${hasActiveFilters ? 'ring-1 ring-[#0066FF]' : ''}`}
        >
          <Filter className="w-4 h-4" />
          {hasActiveFilters && <span className="badge">Active</span>}
        </Button>

        {/* Filter Panel */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-96 bg-[#111111] border border-white/10 rounded-lg shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Filter Assets</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-white/30"
                >
                  <option value="">All</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="ALLOCATED">Allocated</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="RETIRED">Retired</option>
                  <option value="DISPOSED">Disposed</option>
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Condition
                </label>
                <select
                  name="condition"
                  value={filters.condition}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-white/30"
                >
                  <option value="">All</option>
                  <option value="NEW">New</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                  <option value="DAMAGED">Damaged</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={filters.categoryId}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-white/30"
                >
                  <option value="">All</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Department
                </label>
                <select
                  name="departmentId"
                  value={filters.departmentId}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-white/30"
                >
                  <option value="">All</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Location
                </label>
                <select
                  name="locationId"
                  value={filters.locationId}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-white/30"
                >
                  <option value="">All</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Ranges */}
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-sm font-medium text-neutral-300 mb-3">Purchase Date Range</h4>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="purchaseDateStart"
                    value={filters.purchaseDateStart}
                    onChange={handleChange}
                    className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-white/30"
                    placeholder="From"
                  />
                  <input
                    type="date"
                    name="purchaseDateEnd"
                    value={filters.purchaseDateEnd}
                    onChange={handleChange}
                    className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-white/30"
                    placeholder="To"
                  />
                </div>
              </div>

              {/* Warranty Expiry Range */}
              <div>
                <h4 className="text-sm font-medium text-neutral-300 mb-3">Warranty Expiry Range</h4>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="warrantyExpiryStart"
                    value={filters.warrantyExpiryStart}
                    onChange={handleChange}
                    className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-white/30"
                    placeholder="From"
                  />
                  <input
                    type="date"
                    name="warrantyExpiryEnd"
                    value={filters.warrantyExpiryEnd}
                    onChange={handleChange}
                    className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-white/30"
                    placeholder="To"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-white/10 flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleApply}
                disabled={isLoading}
                className="flex-1"
              >
                Apply
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                disabled={isLoading}
              >
                Reset
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
