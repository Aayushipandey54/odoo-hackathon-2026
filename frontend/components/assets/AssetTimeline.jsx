import { useQuery } from '@tanstack/react-query'
import assetService from '../../services/assetService'
import { Calendar, Upload, Zap, Package } from 'lucide-react'

/**
 * Asset Timeline Component
 * Displays immutable timeline of all asset events
 */
export default function AssetTimeline({ assetId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['assetTimeline', assetId],
    queryFn: () => assetService.getTimeline(assetId, { limit: 50, offset: 0 }),
    enabled: !!assetId
  })

  const getEventIcon = (event) => {
    switch (event) {
      case 'ASSET_REGISTERED':
        return <Package className="w-5 h-5" />
      case 'IMAGE_UPLOADED':
      case 'DOCUMENT_UPLOADED':
        return <Upload className="w-5 h-5" />
      case 'QR_CODE_GENERATED':
      case 'QR_CODE_REGENERATED':
        return <Zap className="w-5 h-5" />
      default:
        return <Calendar className="w-5 h-5" />
    }
  }

  const getEventLabel = (event) => {
    return event
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ')
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
              <div className="h-3 bg-white/10 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        Failed to load timeline
      </div>
    )
  }

  const timeline = data?.data || []

  if (timeline.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-400">
        No events recorded
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {timeline.map((event, index) => (
        <div key={event.id} className="flex gap-4">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
              {getEventIcon(event.event)}
            </div>
            {index < timeline.length - 1 && (
              <div className="w-1 h-12 bg-white/10 my-2" />
            )}
          </div>

          {/* Event content */}
          <div className="flex-1 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-white">
                  {getEventLabel(event.event)}
                </p>
                <p className="text-sm text-neutral-300 mt-1">
                  {event.description}
                </p>
              </div>
              <span className="text-xs text-neutral-500 whitespace-nowrap ml-4">
                {formatDate(event.createdAt)}
              </span>
            </div>

            {/* Event details */}
            {event.details && Object.keys(event.details).length > 0 && (
              <div className="mt-3 p-3 bg-white/5 rounded border border-white/10 text-xs text-neutral-300">
                <pre className="whitespace-pre-wrap font-mono">
                  {JSON.stringify(event.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
