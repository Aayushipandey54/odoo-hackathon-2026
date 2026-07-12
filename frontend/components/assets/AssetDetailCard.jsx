import { useState } from 'react'
import { Download, Trash2 } from 'lucide-react'
import AssetStatusBadge from './AssetStatusBadge'
import Button from '../ui/Button'

/**
 * Asset Detail Card Component
 * Displays comprehensive asset information
 */
export default function AssetDetailCard({ asset, onDeleteImage, onDeleteDocument, isDeletingImage, isDeletingDocument }) {
  const [expandedSection, setExpandedSection] = useState(null)

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white">{asset.name}</h3>
            <p className="text-neutral-400">{asset.assetNumber}</p>
          </div>
          <AssetStatusBadge status={asset.status} condition={asset.condition} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Tag</p>
            <p className="text-white font-semibold">{asset.tag}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Category</p>
            <p className="text-white font-semibold">{asset.category?.name}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Department</p>
            <p className="text-white font-semibold">{asset.department?.name}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Location</p>
            <p className="text-white font-semibold">{asset.location?.name}</p>
          </div>
          {asset.serialNumber && (
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide">Serial No.</p>
              <p className="text-white font-semibold">{asset.serialNumber}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Registered</p>
            <p className="text-white font-semibold">{formatDate(asset.createdAt)}</p>
          </div>
        </div>

        {asset.description && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-sm text-neutral-300">{asset.description}</p>
          </div>
        )}
      </div>

      {/* Specifications */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <button
          onClick={() => setExpandedSection(expandedSection === 'specs' ? null : 'specs')}
          className="w-full text-left font-semibold text-white hover:text-[#00F5FF] transition-colors"
        >
          Specifications {expandedSection === 'specs' ? '▼' : '▶'}
        </button>

        {expandedSection === 'specs' && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {asset.manufacturer && (
              <div>
                <p className="text-xs text-neutral-500 uppercase">Manufacturer</p>
                <p className="text-white">{asset.manufacturer}</p>
              </div>
            )}
            {asset.model && (
              <div>
                <p className="text-xs text-neutral-500 uppercase">Model</p>
                <p className="text-white">{asset.model}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Purchase & Warranty */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <button
          onClick={() => setExpandedSection(expandedSection === 'purchase' ? null : 'purchase')}
          className="w-full text-left font-semibold text-white hover:text-[#00F5FF] transition-colors"
        >
          Purchase & Warranty {expandedSection === 'purchase' ? '▼' : '▶'}
        </button>

        {expandedSection === 'purchase' && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-neutral-500 uppercase">Purchase Date</p>
              <p className="text-white">{formatDate(asset.purchaseDate)}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase">Purchase Cost</p>
              <p className="text-white">{formatCurrency(asset.purchaseCost)}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase">Warranty Expiry</p>
              <p className="text-white">{formatDate(asset.warrantyExpiry)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Images */}
      {asset.images && asset.images.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <button
            onClick={() => setExpandedSection(expandedSection === 'images' ? null : 'images')}
            className="w-full text-left font-semibold text-white hover:text-[#00F5FF] transition-colors mb-4"
          >
            Images ({asset.images.length}) {expandedSection === 'images' ? '▼' : '▶'}
          </button>

          {expandedSection === 'images' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {asset.images.map(image => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt="Asset"
                    className="w-full h-32 object-cover rounded bg-white/5"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
                    <a
                      href={image.url}
                      download
                      className="p-2 bg-[#0066FF] hover:bg-[#0052CC] rounded text-white"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => onDeleteImage(image.id)}
                      disabled={isDeletingImage}
                      className="p-2 bg-red-500 hover:bg-red-600 rounded text-white disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-[#00F5FF]/20 border border-[#00F5FF] text-[#00F5FF] text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Documents */}
      {asset.documents && asset.documents.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <button
            onClick={() => setExpandedSection(expandedSection === 'docs' ? null : 'docs')}
            className="w-full text-left font-semibold text-white hover:text-[#00F5FF] transition-colors mb-4"
          >
            Documents ({asset.documents.length}) {expandedSection === 'docs' ? '▼' : '▶'}
          </button>

          {expandedSection === 'docs' && (
            <div className="space-y-2">
              {asset.documents.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{doc.filename}</p>
                    <p className="text-xs text-neutral-400">
                      {doc.documentType} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <a
                      href={doc.url}
                      download
                      className="p-2 hover:bg-white/10 rounded transition-colors"
                    >
                      <Download className="w-4 h-4 text-[#0066FF]" />
                    </a>
                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      disabled={isDeletingDocument}
                      className="p-2 hover:bg-white/10 rounded transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
