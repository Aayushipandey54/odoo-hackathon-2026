import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Search, Filter, Package, Eye, Edit, Trash2, Plus, Loader } from 'lucide-react'
import assetService from '../../services/assetService'
import AssetFilters from '../../components/assets/AssetFilters'
import AssetStatusBadge from '../../components/assets/AssetStatusBadge'

/**
 * Assets Page
 * Main listing of all assets with search, filter, and pagination
 */
export default function AssetsPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})
  const [pagination, setPagination] = useState({ limit: 20, offset: 0 })

  // Fetch assets
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['assets', searchTerm, filters, pagination],
    queryFn: () => assetService.search({
      search: searchTerm,
      ...filters,
      ...pagination
    })
  })

  const handleSearch = (value) => {
    setSearchTerm(value)
    setPagination({ limit: 20, offset: 0 })
  }

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters)
    setPagination({ limit: 20, offset: 0 })
  }

  const handleDelete = async (assetId) => {
    if (!confirm('Are you sure you want to delete this asset?')) return

    try {
      await assetService.delete(assetId)
      refetch()
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const assets = data?.data || []
  const total = data?.total || 0
  const hasMore = data?.hasMore || false

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Asset Directory</h1>
          <p className="text-neutral-400 text-sm">Manage all company assets and equipment</p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/app/assets/register')}
          className="gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Register Asset
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by name, tag, serial number..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-[#111111] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <AssetFilters onApplyFilters={handleApplyFilters} />
      </div>

      {/* Results Count */}
      <div className="text-sm text-neutral-400">
        {isLoading ? (
          'Loading assets...'
        ) : (
          `${total > 0 ? `Showing ${assets.length} of ${total} assets` : 'No assets found'}`
        )}
      </div>

      {/* Table Card */}
      <Card className="flex-1 bg-[#111111] border-white/10 overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-[#00F5FF] animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-400">
            Failed to load assets. Please try again.
          </div>
        ) : assets.length === 0 ? (
          <div className="p-6 text-center text-neutral-400">
            No assets found. Create your first asset!
          </div>
        ) : (
          <>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="p-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Asset ID & Name</th>
                    <th className="p-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Category</th>
                    <th className="p-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Department</th>
                    <th className="p-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-neutral-400">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{asset.name}</p>
                            <p className="text-xs text-neutral-500">{asset.assetNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-neutral-300">{asset.category?.name}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-neutral-300">{asset.department?.name}</span>
                      </td>
                      <td className="p-4">
                        <AssetStatusBadge status={asset.status} />
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/app/assets/${asset.id}`)}
                            className="p-2 hover:bg-white/10 rounded transition-colors text-neutral-400 hover:text-white"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/app/assets/${asset.id}/edit`)}
                            className="p-2 hover:bg-white/10 rounded transition-colors text-neutral-400 hover:text-[#0066FF]"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(asset.id)}
                            className="p-2 hover:bg-white/10 rounded transition-colors text-neutral-400 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {total > pagination.limit && (
              <div className="border-t border-white/10 p-4 flex items-center justify-between">
                <span className="text-sm text-neutral-400">
                  Page {Math.floor(pagination.offset / pagination.limit) + 1}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPagination(p => ({ ...p, offset: Math.max(0, p.offset - p.limit) }))}
                    disabled={pagination.offset === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPagination(p => ({ ...p, offset: p.offset + p.limit }))}
                    disabled={!hasMore}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
